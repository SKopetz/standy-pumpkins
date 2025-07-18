import React from 'react';
import type { DayWithEvents } from '../../types/calendar.types';
import { EventBadge } from './EventBadge';
import { useAuthContext } from '../../contexts/AuthContext';

interface CalendarDayProps {
  day: DayWithEvents;
  onEventClick: (event: Event) => void;
  onSignInRequired: () => void;
}

export function CalendarDay({ day, onEventClick, onSignInRequired }: CalendarDayProps) {
  const isToday = day.isToday;
  const isCurrentMonth = !day.isOutsideMonth;

  return (
    <div
      className={`min-h-[120px] p-2 ${
        isCurrentMonth ? 'bg-white' : 'bg-light-hover'
      }`}
    >
      <div className="flex justify-between items-start">
        <span
          className={`text-sm font-medium ${
            isToday
              ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full'
              : isCurrentMonth
              ? 'text-dark'
              : 'text-dark/40'
          }`}
        >
          {day.date.getDate()}
        </span>
      </div>
      <div className="mt-2 space-y-1">
        {day.events.map(event => (
          <EventBadge 
            key={event.id} 
            event={event} 
            onClick={() => onEventClick(event)}
            onSignInRequired={onSignInRequired}
          />
        ))}
      </div>
    </div>
  );
}