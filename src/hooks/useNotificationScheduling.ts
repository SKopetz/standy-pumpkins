import { useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { scheduleMessage } from '../lib/notifications/twilioService';
import { createReminderMessage } from '../lib/notifications/messageTemplates';
import { getScheduledTime } from '../lib/notifications/schedulingRules';

export function useNotificationScheduling() {
  useEffect(() => {
    const checkPendingNotifications = async () => {
      try {
        // Get pending notifications with event and volunteer details
        const { data: notifications, error: fetchError } = await supabase
          .from('notifications')
          .select(`
            *,
            volunteer:volunteers (
              phone,
              event:events (
                id,
                title,
                eventDate,
                startTime
              )
            )
          `)
          .eq('status', 'pending');

        if (fetchError) throw fetchError;
        if (!notifications?.length) return;

        const now = new Date();
        const thirtyFiveMinutes = 35 * 60 * 1000; // 35 minutes in milliseconds
        const thirtyFiveDays = 35 * 24 * 60 * 60 * 1000; // 35 days in milliseconds

        // Process each notification
        for (const notification of notifications) {
          try {
            const eventDate = new Date(notification.volunteer.event.eventDate);
            
            // Skip if event date is invalid or in the past
            if (isNaN(eventDate.getTime()) || eventDate < now) {
              await updateNotificationStatus(notification.id, 'cancelled', 'Event date invalid or in past');
              continue;
            }

            const scheduledTime = getScheduledTime(eventDate);
            
            // Skip if scheduled time is too soon or too far in the future
            if (scheduledTime.getTime() - now.getTime() < thirtyFiveMinutes || 
                scheduledTime.getTime() - now.getTime() > thirtyFiveDays) {
              await updateNotificationStatus(notification.id, 'cancelled', 'Scheduled time outside valid range');
              continue;
            }

            const message = createReminderMessage({
              title: notification.volunteer.event.title,
              eventDate: notification.volunteer.event.eventDate,
              time: notification.volunteer.event.startTime
            });

            // Skip if message creation failed
            if (!message) {
              await updateNotificationStatus(notification.id, 'cancelled', 'Failed to create message');
              continue;
            }

            // Schedule with Twilio
            const messageSid = await scheduleMessage({
              to: notification.volunteer.phone,
              body: message,
              scheduleType: 'fixed',
              sendAt: scheduledTime
            });

            // Update notification record
            await updateNotificationStatus(notification.id, 'scheduled', null, messageSid, scheduledTime);
          } catch (error) {
            console.error('Failed to process notification:', error);
            await updateNotificationStatus(notification.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
          }
        }
      } catch (error) {
        console.error('Failed to process pending notifications:', error);
      }
    };

    const updateNotificationStatus = async (
      id: string, 
      status: string, 
      error?: string | null,
      messageSid?: string,
      scheduledFor?: Date
    ) => {
      await supabase
        .from('notifications')
        .update({
          status,
          error_message: error,
          message_sid: messageSid,
          scheduled_for: scheduledFor?.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    };

    checkPendingNotifications();
  }, []); // Run once when admin dashboard loads
}