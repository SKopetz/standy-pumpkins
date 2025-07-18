import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Event } from '../types/calendar.types';

interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  category: string;
}

export function useEventManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (data: EventFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { error: createError } = await supabase
        .from('events')
        .insert([{
          title: data.title,
          description: data.description || null,
          eventDate: data.eventDate,
          startTime: data.startTime || null,
          endTime: data.endTime || null,
          capacity: data.capacity || null,
          category: data.category
        }]);

      if (createError) throw createError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create event';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, data: EventFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Check if capacity is being reduced
      const { data: currentEvent } = await supabase
        .from('events')
        .select('capacity')
        .eq('id', eventId)
        .single();

      if (data.capacity && currentEvent?.capacity && data.capacity < currentEvent.capacity) {
        // Get current volunteer count
        const { data: volunteers, error: countError } = await supabase
          .from('volunteers')
          .select('group_size')
          .eq('event_id', eventId);

        if (countError) throw countError;

        const currentVolunteers = volunteers?.reduce((sum, v) => sum + v.group_size, 0) || 0;
        
        if (data.capacity < currentVolunteers) {
          throw new Error(`Cannot reduce capacity below current volunteer count (${currentVolunteers})`);
        }
      }

      const { error: updateError } = await supabase
        .from('events')
        .update({
          title: data.title,
          description: data.description || null,
          eventDate: data.eventDate,
          startTime: data.startTime || null,
          endTime: data.endTime || null,
          capacity: data.capacity || null,
          category: data.category
        })
        .eq('id', eventId);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: volunteers, error: countError } = await supabase
        .from('volunteers')
        .select('id')
        .eq('event_id', eventId);

      if (countError) throw countError;

      if (volunteers && volunteers.length > 0) {
        throw new Error('Cannot delete event with registered volunteers');
      }

      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    loading,
    error
  };
}