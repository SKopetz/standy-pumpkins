import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import type { DayWithEvents } from '../../types/calendar.types';
import { formatEventDate, formatTime } from '../../utils/dateUtils';
import { useVolunteers } from '../../hooks/useVolunteers';
import { useMobileCalendar } from '../../hooks/useMobileCalendar';
import { Button } from '../ui/Button';

interface EventItemProps {
  event: any;
  onClick: () => void;
  onSignInRequired: () => void;
}

function EventItem({ event, onClick, onSignInRequired }: EventItemProps) {
  const { profile } = useAuthContext();
  const { volunteerCount } = useVolunteers(event.id);
  const isFull = event.capacity && volunteerCount >= event.capacity;

  const categoryColors = {
    Patch: 'border-blue-500 bg-blue-50',
    Closing: 'border-purple-500 bg-purple-50',
    Staff: 'border-green-500 bg-green-50',
    Other: 'border-orange-500 bg-orange-50'
  };

  const colorClasses = categoryColors[event.category as keyof typeof categoryColors] || 'border-gray-500 bg-gray-50';

  return (
    <button
      onClick={() => profile ? onClick() : onSignInRequired()}
      className={`w-full text-left p-3 border-l-4 ${colorClasses} hover:bg-light/50 transition-colors`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className={`text-sm font-medium ${isFull ? 'text-dark/40' : 'text-dark'}`}>
            {event.title}
          </h4>
          {event.startTime && event.endTime && (
            <p className={`text-xs mt-1 ${isFull ? 'text-dark/30' : 'text-dark/60'}`}>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </p>
          )}
        </div>
        {event.capacity && (
          <span className={`text-xs ml-2 whitespace-nowrap ${isFull ? 'text-dark/30' : 'text-dark/60'}`}>
            ({volunteerCount}/{event.capacity})
          </span>
        )}
      </div>
    </button>
  );
}

interface MobileCalendarViewProps {
  days: DayWithEvents[];
  onEventClick: (event: any) => void;
  onSignInRequired: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function MobileCalendarView({ 
  days, 
  onEventClick, 
  onSignInRequired,
  onPrevious, 
  onNext
}: MobileCalendarViewProps) {
  const {
    visibleDays,
    dateRange,
    loadMore,
    hasMore,
    isLoading
  } = useMobileCalendar(days);

  const daysWithEvents = visibleDays.filter(day => 
    !day.isOutsideMonth && day.events.length > 0
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-bold text-dark">
          {dateRange}
        </h2>
        <button
          onClick={onNext}
          className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {daysWithEvents.length === 0 ? (
        <div className="text-center py-6 text-dark/60 text-sm">
          No events scheduled
        </div>
      ) : (
        <div className="space-y-3">
          {daysWithEvents.map((day, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm">
              <div className={`px-3 py-2 ${day.isToday ? 'bg-primary/10' : 'bg-light'} rounded-t-lg`}>
                <h3 className="text-sm font-medium text-dark">
                  {formatEventDate(day.date.toISOString().split('T')[0])}
                </h3>
              </div>
              <div className="divide-y divide-light">
                {day.events.map(event => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick(event)}
                    onSignInRequired={onSignInRequired}
                  />
                ))}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="pt-4">
              <Button 
                onClick={loadMore} 
                variant="secondary"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Events'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}