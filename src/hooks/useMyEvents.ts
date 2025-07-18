import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import type { Event } from '../types/calendar.types';

export function useMyEvents() {
  const { profile } = useAuthContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!profile?.email) return;

    try {
      const { data: volunteers, error: volunteersError } = await supabase
        .from('volunteers')
        .select('event_id')
        .eq('email', profile.email)
        .order('created_at', { ascending: false });

      if (volunteersError) throw volunteersError;

      const eventIds = volunteers?.map(v => v.event_id) || [];

      if (eventIds.length === 0) {
        setEvents([]);
        return;
      }

      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds)
        .gte('eventDate', new Date().toISOString().split('T')[0])
        .order('eventDate', { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [profile?.email]);

  useRealtimeSubscription([
    { table: 'volunteers' },
    { table: 'events' }
  ], fetchEvents);

  return { events, loading, error };
}