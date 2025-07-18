import { formatShortDate, formatTime} from '../../utils/dateUtils';
import { validateEventDate } from './dateUtils';
import type { NotificationMessage } from './types';

interface EventInfo {
  title: string;
  eventDate: string;
  startTime?: string;
}

export function createReminderMessage(event: EventInfo): string {
  try {
    const eventDate = validateEventDate(event.eventDate);
    
    // Silently return empty string if event date has passed
    if (eventDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      return '';
    }
    
    const formattedDate = formatShortDate(event.eventDate);
    const formattedTime = formatTime(event.startTime);
    return `Reminder: You have volunteered for the ${event.title} at the Pumpkin Patch tomorrow, ${formattedDate} at ${formattedTime}. Please arrive 10-15 minutes early to check in. Visit https://pumpkinchurch.com/pumpkinsignup for shift details and location information. Thank you for volunteering!`;
  } catch (error) {
    console.error('Error creating reminder message:', error);
    // Return empty string if there's any error
    return '';
  }
}