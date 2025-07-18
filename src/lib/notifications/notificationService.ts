import { supabase } from '../supabase/client';
import { scheduleMessage } from './twilioService';
import { createReminderMessage } from './messageTemplates';
import { validateEventDate, getNotificationDate } from './dateUtils';
import type { Event } from '../../types/calendar.types';

function isTwilioConfigured(): boolean {
  const config = import.meta.env.VITE_TWILIO_ACCOUNT_SID && 
                import.meta.env.VITE_TWILIO_AUTH_TOKEN && 
                import.meta.env.VITE_TWILIO_PHONE_NUMBER;
  return !!config;
}

export async function scheduleEventNotification(
  volunteerId: string,
  event: Event,
  phone: string,
  email: string
): Promise<void> {
  // Skip notification scheduling if required data is missing
  if (!email || !phone || !volunteerId) {
    console.warn('Missing required data for notification scheduling');
    return;
  }

  try {
    // Skip if Twilio is not configured
    if (!isTwilioConfigured()) {
      console.info('Twilio not configured - skipping notification scheduling');
      return;
    }

    // Validate event date first
    const eventDate = validateEventDate(event.eventDate);
    const notificationDate = getNotificationDate(eventDate);

    // Check SMS preference
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('smspreference')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile?.smspreference) return;

    // Create notification record first
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        volunteer_id: volunteerId,
        message: createReminderMessage(event),
        status: 'pending',
        scheduled_for: notificationDate.toISOString()
      })
      .select()
      .single();

    if (notificationError) throw notificationError;

    // Schedule message with Twilio
    const message = createReminderMessage(event);
    if (!message) return;

    const messageSid = await scheduleMessage({
      to: phone,
      body: message,
      scheduleType: 'fixed',
      sendAt: notificationDate
    });

    // Create notification record
    // Update notification with message ID
    if (notification) {
      await supabase
        .from('notifications')
        .update({
          status: 'scheduled',
          message_sid: messageSid,
          sent_at: new Date().toISOString()
        })
        .eq('id', notification.id);
    }
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    // Log error but don't throw to prevent breaking registration
  }
}