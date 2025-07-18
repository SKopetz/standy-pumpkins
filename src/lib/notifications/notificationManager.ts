import { supabase } from '../supabase/client';
import { cancelScheduledMessage } from './twilioService';
import type { NotificationRecord } from './types';

export async function handleNotificationCancellation(volunteerId: string): Promise<void> {
  try {
    // Get notification record
    const { data: notification, error: fetchError } = await supabase
      .from('notifications')
      .select('*')
      .eq('volunteer_id', volunteerId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!notification) return; // No notification to cancel

    // If status is scheduled, cancel the Twilio message
    if (notification.status === 'scheduled' && notification.message_sid) {
      await cancelScheduledMessage(notification.message_sid);
    }

    // Delete the notification record
    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .eq('volunteer_id', volunteerId);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Failed to cancel notification:', error);
    throw error;
  }
}