import { scheduleMessage } from './twilioService';
import { formatShortDate, formatTime} from '../../utils/dateUtils';
import { supabase } from '../supabase';
import type { Event } from '../../types/calendar.types';

export async function sendImmediateConfirmation(
  phone: string,
  eventId: string
): Promise<void> {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw error;
    if (!event) throw new Error('Event not found');

    const formattedDate = formatShortDate(event.eventDate);
    const formattedTime = formatTime(event.startTime);
    const message = `Thank you for volunteering for the St. Andrew's Pumpkin Patch ${event.title} on ${formattedDate} at ${formattedTime}. Visit https://pumpkinchurch.com/pumpkinsignup to view or change your shift`;

    await scheduleMessage({
      to: phone,
      body: message
    });
  } catch (error) {
    console.error('Failed to send immediate confirmation:', error);
    throw error;
  }
}