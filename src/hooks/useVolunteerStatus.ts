import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { handleNotificationCancellation } from '../lib/notifications/notificationManager';
import type { Volunteer } from '../types/volunteer.types';

export function useVolunteerStatus(eventId: string, userEmail: string | null) {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteerStatus = useCallback(async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('email', userEmail)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setVolunteer(data);
    } catch (err) {
      console.error('Error fetching volunteer status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check volunteer status');
    } finally {
      setLoading(false);
    }
  }, [eventId, userEmail]);

  useEffect(() => {
    fetchVolunteerStatus();
  }, [fetchVolunteerStatus]);

  useRealtimeSubscription({
    table: 'volunteers',
    filter: `event_id=eq.${eventId}${userEmail ? ` AND email=eq.${userEmail}` : ''}`
  }, fetchVolunteerStatus);

  const cancelVolunteer = async () => {
    if (!volunteer) return;
    
    try {
      setLoading(true);
      
      // Cancel notification first
      await handleNotificationCancellation(volunteer.id);

      // Then delete volunteer record
      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('event_id', eventId)
        .eq('email', userEmail);

      if (error) throw error;
      
      setVolunteer(null);
    } catch (err) {
      console.error('Error canceling volunteer:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { volunteer, loading, error, cancelVolunteer };
}