import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from './useRealtimeSubscription';

export interface EventVolunteer {
  first_name: string;
  last_name: string;
  group_size: number;
}

export function useEventVolunteers(eventId: string) {
  const [volunteers, setVolunteers] = useState<EventVolunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('first_name, last_name, group_size')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  useRealtimeSubscription({
    table: 'volunteers',
    filter: `event_id=eq.${eventId}`
  }, fetchVolunteers);

  return { volunteers, loading, error };
}