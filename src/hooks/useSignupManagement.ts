import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface SignupUpdateData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  group_size: number;
}

interface CapacityCheck {
  allowed: boolean;
  currentTotal: number;
  capacity: number;
  availableSpots: number;
  error?: string;
}

export function useSignupManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkEventCapacity = async (
    eventId: string,
    signupId: string,
    newGroupSize: number
  ): Promise<CapacityCheck> => {
    // Get event capacity
    const { data: event } = await supabase
      .from('events')
      .select('capacity')
      .eq('id', eventId)
      .single();

    if (!event?.capacity) {
      return { allowed: true, currentTotal: 0, capacity: 0, availableSpots: 0 };
    }

    // Get all volunteers except current signup
    const { data: volunteers } = await supabase
      .from('volunteers')
      .select('group_size')
      .eq('event_id', eventId)
      .neq('id', signupId);

    const otherVolunteersTotal = (volunteers || []).reduce((sum, v) => sum + v.group_size, 0);
    const availableSpots = event.capacity - otherVolunteersTotal;

    return {
      allowed: newGroupSize <= availableSpots,
      currentTotal: otherVolunteersTotal,
      capacity: event.capacity,
      availableSpots,
      error: newGroupSize > availableSpots
        ? `Unable to increase participants. The requested change would exceed the event's capacity of ${event.capacity}. Currently ${otherVolunteersTotal} spots are taken by other volunteers, leaving ${availableSpots} spots available.`
        : undefined
    };
  };

  const updateSignup = async (signupId: string, data: SignupUpdateData) => {
    setLoading(true);
    setError(null);

    try {
      // Get current signup
      const { data: signup } = await supabase
        .from('volunteers')
        .select('event_id, group_size')
        .eq('id', signupId)
        .single();

      if (!signup) throw new Error('Signup not found');

      // Check capacity if group size is being increased
      if (data.group_size > signup.group_size) {
        const capacityCheck = await checkEventCapacity(
          signup.event_id,
          signupId,
          data.group_size
        );

        if (!capacityCheck.allowed) {
          throw new Error(capacityCheck.error);
        }
      }

      const { error: updateError } = await supabase
        .from('volunteers')
        .update(data)
        .eq('id', signupId);

      if (updateError) throw updateError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update signup';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSignup = async (signupId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('volunteers')
        .delete()
        .eq('id', signupId);

      if (deleteError) throw deleteError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete signup';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateSignup,
    deleteSignup,
    loading,
    error
  };
}