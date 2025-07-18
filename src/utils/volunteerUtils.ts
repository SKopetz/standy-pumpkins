import { supabase } from '../lib/supabase';
import { validateCapacityChange } from './capacityValidation';
import type { Volunteer } from '../types/volunteer.types';

export async function checkEventCapacity(
  eventId: string,
  requestedSlots: number,
  existingVolunteer: Volunteer | null,
  eventCapacity: number
) {
  try {
    // Get all volunteer registrations for this event
    const { data: volunteers, error } = await supabase
      .from('volunteers')
      .select('group_size')
      .eq('event_id', eventId);

    if (error) throw error;

    // Calculate total slots currently taken
    const currentTotal = volunteers?.reduce((sum, v) => sum + v.group_size, 0) || 0;

    return validateCapacityChange(
      requestedSlots,
      currentTotal,
      eventCapacity,
      existingVolunteer
    );
  } catch (err) {
    return {
      allowed: false,
      currentTotal: 0,
      capacity: eventCapacity,
      availableSpots: 0,
      error: err instanceof Error ? err.message : 'Failed to check event capacity'
    };
  }
}