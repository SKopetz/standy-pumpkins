import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Event } from '../types/event.types';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('eventDate', new Date().toISOString().split('T')[0])
        .order('eventDate', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Subscribe to changes
    const subscription = supabase
      .channel('events_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' }, 
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { events, isLoading, error, refetch: fetchEvents };
}