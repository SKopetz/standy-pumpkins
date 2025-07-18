import { addDays } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const TIMEZONE = 'America/Chicago';

export function formatDateTime(dateString: string): string {
  // First convert the UTC date to Chicago time
  const chicagoDate = utcToZonedTime(new Date(dateString), TIMEZONE);
  
  // Format using Intl.DateTimeFormat to properly handle DST
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TIMEZONE,
    hour12: true
  }).format(chicagoDate);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: TIMEZONE
  });
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: TIMEZONE
  });
}

export function formatEventDate(dateString: string): string {
  // Parse the date string directly without timezone conversion
  const [year, month, day] = dateString.split('-').map(Number);
  // Create date at noon to avoid any timezone edge cases
  const date = new Date(year, month - 1, day, 12, 0, 0);
  
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function formatShortMonth(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short' });
}

export function formatMobileDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

export function getStartOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getEndOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (6 - day));
  result.setHours(23, 59, 59, 999);
  return result;
}

export function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

export function isLastMinuteCancellation(eventDate: string): boolean {
  const event = new Date(eventDate);
  const twoDaysFromNow = addDays(new Date(), 2);
  return event <= twoDaysFromNow;
}