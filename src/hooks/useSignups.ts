import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import type { VolunteerWithEvent } from '../types/volunteer.types';

export function useSignups() {
  const [signups, setSignups] = useState<VolunteerWithEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignups = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select(`
          *,
          event:events (
            id,
            title,
            eventDate,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignups(data || []);
    } catch (err) {
      console.error('Error fetching signups:', err);
      setError(err instanceof Error ? err.message : 'Failed to load signups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignups();
  }, []);

  // Subscribe to both volunteers and events tables for real-time updates
  useRealtimeSubscription([
    { 
      table: 'volunteers',
      event: '*' // Listen for all changes (INSERT, UPDATE, DELETE)
    },
    { 
      table: 'events',
      event: '*'
    }
  ], fetchSignups);

  return { signups, isLoading, error, refetch: fetchSignups };
}