import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Shift = Database['public']['Tables']['shifts']['Row'];
type VolunteerShift = Database['public']['Tables']['volunteer_shifts']['Row'];

export function useShifts(eventId: string) {
  const [shifts, setShifts] = useState<(Shift & { volunteer_shifts: VolunteerShift[] })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = async () => {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select(`
          *,
          volunteer_shifts (*)
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setShifts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();

    const subscription = supabase
      .channel('shifts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shifts' },
        () => {
          fetchShifts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [eventId]);

  const signUpForShift = async (shiftId: string) => {
    try {
      const { error } = await supabase
        .from('volunteer_shifts')
        .insert([{ shift_id: shiftId }]);

      if (error) throw error;
      await fetchShifts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return { shifts, isLoading, error, signUpForShift };
}