import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useDeleteEvent(onClose: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Check if event has volunteers
      const { data: volunteers, error: countError } = await supabase
        .from('volunteers')
        .select('id')
        .eq('event_id', eventId);

      if (countError) throw countError;

      if (volunteers && volunteers.length > 0) {
        setError('Cannot delete event with registered volunteers');
        return;
      }

      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (deleteError) throw deleteError;
      onClose();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  return { deleteEvent, loading, error };
}