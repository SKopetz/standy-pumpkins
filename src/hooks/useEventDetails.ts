import { useState, useCallback, useEffect } from 'react';
import { Event } from '../types/calendar.types';

export function useEventDetails() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showEventDetails = useCallback((event: Event) => {
    setSelectedEvent(event);
  }, []);

  const closeEventDetails = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return {
    selectedEvent,
    isMobile,
    showEventDetails,
    closeEventDetails
  };
}