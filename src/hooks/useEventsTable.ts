import { useState, useCallback } from 'react';
import { useEvents } from './useEvents';
import type { Event } from '../types/event.types';

export function useEventsTable() {
  const { events, isLoading, error, refetch } = useEvents();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const categories = ['Patch', 'Closing', 'Staff', 'Other'];

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const filteredEvents = events.filter(event => 
    selectedCategories.size === 0 || selectedCategories.has(event.category)
  );

  return {
    events: filteredEvents,
    categories,
    selectedCategories,
    toggleCategory,
    isLoading,
    error,
    refetch: refetch
  };
}