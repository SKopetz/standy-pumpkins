import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Event } from '../types/calendar.types';

interface FormData {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  category: string;
}

export function useEditEvent(event: Event, onClose: () => void) {
  const [formData, setFormData] = useState<FormData>({
    title: event.title,
    description: event.description || '',
    eventDate: event.eventDate,
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    capacity: event.capacity || 1,
    category: event.category
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check current volunteer count
      const { data: volunteers, error: countError } = await supabase
        .from('volunteers')
        .select('group_size')
        .eq('event_id', event.id);

      if (countError) throw countError;

      const currentVolunteers = volunteers?.reduce((sum, v) => sum + v.group_size, 0) || 0;

      if (formData.capacity < currentVolunteers) {
        throw new Error(`Cannot reduce capacity below current volunteer count (${currentVolunteers})`);
      }

      const { error: updateError } = await supabase
        .from('events')
        .update({
          title: formData.title,
          description: formData.description,
          eventDate: formData.eventDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          capacity: formData.capacity,
          category: formData.category
        })
        .eq('id', event.id);

      if (updateError) throw updateError;
      onClose();
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err instanceof Error ? err.message : 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error
  };
}