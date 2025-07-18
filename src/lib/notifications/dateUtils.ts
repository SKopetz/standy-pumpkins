// Dedicated date utilities for notifications
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const TIMEZONE = 'America/Chicago';

export function validateEventDate(date: string | Date): Date {
  const eventDate = new Date(date + 'T00:00:00');
  
  // Check if date is invalid
  if (isNaN(eventDate.getTime())) {
    throw new Error('Invalid event date provided');
  }
  
  return eventDate;
}

export function getNotificationDate(eventDate: Date): Date {
  const now = new Date();
  const thirtyFiveMinutes = 35 * 60 * 1000; // 35 minutes in milliseconds
  const chicagoNow = utcToZonedTime(now, TIMEZONE);
  
  // Convert to Chicago timezone
  const notificationDate = eventDate;
  notificationDate.setDate(notificationDate.getDate() - 1); // Day before
  notificationDate.setHours(10, 0, 0, 0); // 10 AM
  
  // If notification time would be less than 35 minutes from now,
  // schedule for 35 minutes from now instead
  if (notificationDate.getTime() - chicagoNow.getTime() < thirtyFiveMinutes) {
    const adjustedTime = new Date(chicagoNow.getTime() + thirtyFiveMinutes);
    // Round to next minute
    adjustedTime.setSeconds(0, 0);
    return zonedTimeToUtc(adjustedTime, TIMEZONE);
  }
  
  // Convert back to UTC before returning
  return zonedTimeToUtc(notificationDate, TIMEZONE);
}