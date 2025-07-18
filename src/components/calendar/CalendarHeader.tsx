import React from 'react';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function CalendarHeader() {
  return (
    <div className="grid grid-cols-7 gap-px bg-dark/5 rounded-t-lg overflow-hidden">
      {WEEKDAYS.map(day => (
        <div
          key={day}
          className="bg-light-hover p-2 text-center text-sm font-medium text-dark/70"
        >
          {day.slice(0, 3)}
        </div>
      ))}
    </div>
  );
}