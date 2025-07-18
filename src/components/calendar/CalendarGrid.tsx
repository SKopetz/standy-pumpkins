import React from 'react';
import { CalendarDay } from './CalendarDay';
import type { DayWithEvents, Event } from '../../types/calendar.types';

interface CalendarGridProps {
  days: DayWithEvents[];
  onEventClick: (event: Event) => void;
  onSignInRequired: () => void;
}

export function CalendarGrid({ days, onEventClick, onSignInRequired }: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-px bg-dark/5 rounded-b-lg overflow-hidden">
      {days.map((day, index) => (
        <CalendarDay 
          key={index} 
          day={day} 
          onEventClick={onEventClick}
          onSignInRequired={onSignInRequired}
        />
      ))}
    </div>
  );
}