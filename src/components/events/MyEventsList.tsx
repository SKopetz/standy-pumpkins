import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useMyEvents } from '../../hooks/useMyEvents';
import { formatEventDate, formatTime } from '../../utils/dateUtils';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EventDetails } from '../calendar/EventDetails';

export function MyEventsList() {
  const { events, loading, error } = useMyEvents();
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading events: {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-dark/60 text-center py-8">
        You haven't signed up for any upcoming events yet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {events.map(event => (
          <button
            key={event.id}
            className="w-full text-left bg-light p-4 rounded-lg hover:bg-light-hover transition-colors"
            onClick={() => setSelectedEvent(event)}
          >
            <h3 className="font-medium text-dark mb-2">{event.title}</h3>
            {event.description && (
              <p className="text-dark/70 text-sm mb-3">{event.description}</p>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-dark/70">
                <Calendar className="w-4 h-4" />
                <span>{formatEventDate(event.eventDate)}</span>
              </div>
              {event.startTime && event.endTime && (
                <div className="flex items-center gap-2 text-sm text-dark/70">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isModal={true}
        />
      )}
    </>
  );
}