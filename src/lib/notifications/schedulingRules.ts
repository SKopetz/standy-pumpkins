export function getScheduledTime(eventDate: Date): Date {
  const now = new Date();
  const thirtyFiveMinutes = 35 * 60 * 1000; // 35 minutes in milliseconds
  
  // Calculate reminder time (day before at 10am)
  const reminderDate = new Date(eventDate);
  reminderDate.setDate(reminderDate.getDate() - 1);
  reminderDate.setHours(10, 0, 0, 0);
  
  // If reminder time would be less than 35 minutes from now,
  // schedule for 35 minutes from now instead
  if (reminderDate.getTime() - now.getTime() < thirtyFiveMinutes) {
    const adjustedTime = new Date(now.getTime() + thirtyFiveMinutes);
    // Round to next minute
    adjustedTime.setSeconds(0, 0);
    return adjustedTime;
  }
  
  return reminderDate;
}

export function shouldScheduleImmediately(eventDate: Date): boolean {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return eventDate < thirtyDaysFromNow;
}