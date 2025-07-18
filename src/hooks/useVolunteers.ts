import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from './useRealtimeSubscription';

export function useVolunteers(eventId: string) {
  const [volunteerCount, setVolunteerCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteers = useCallback(async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('group_size')
        .eq('event_id', eventId);

      if (error) throw error;

      const total = data?.reduce((sum, v) => sum + (v.group_size || 0), 0) || 0;
      setVolunteerCount(total);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Initial fetch
  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  // Subscribe to volunteer changes
  useRealtimeSubscription({
    table: 'volunteers',
    filter: `event_id=eq.${eventId}`
  }, fetchVolunteers);

  return { volunteerCount, loading, error };
}