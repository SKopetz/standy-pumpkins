import { useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { scheduleEventNotification } from '../lib/notifications/notificationService';
import { useAuthContext } from '../contexts/AuthContext';
import type { Event } from '../types/calendar.types';
import type { Volunteer } from '../types/volunteer.types';

interface RegistrationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  volunteer: Volunteer | null;
}

export function useVolunteerRegistration(event: Event) {
  const { profile } = useAuthContext();
  const [state, setState] = useState<RegistrationState>({
    loading: false,
    error: null,
    success: false,
    volunteer: null
  });

  const registerVolunteer = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    groupSize: number;
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check if volunteer already exists for this event
      const { data: existingVolunteer } = await supabase
        .from('volunteers')
        .select('id')
        .eq('email', formData.email.toLowerCase())
        .eq('event_id', event.id)
        .maybeSingle();

      let volunteer;

      if (existingVolunteer) {
        // Update existing volunteer
        const { data: updatedVolunteer, error: updateError } = await supabase
          .from('volunteers')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            group_size: formData.groupSize
          })
          .eq('id', existingVolunteer.id)
          .select()
          .single();

        if (updateError) throw updateError;
        volunteer = updatedVolunteer;
      } else {
        // Create new volunteer
        const { data: newVolunteer, error: insertError } = await supabase
          .from('volunteers')
          .insert([{
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email.toLowerCase(),
            phone: formData.phone,
            group_size: formData.groupSize,
            event_id: event.id
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        volunteer = newVolunteer;
      }

      if (!volunteer) throw new Error('Failed to create volunteer registration');

      // Schedule notification
      await scheduleEventNotification(
        volunteer.id,
        event,
        formData.phone,
        formData.email
      );

      setState({
        loading: false,
        error: null,
        success: true,
        volunteer
      });

      return { volunteer };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Registration failed. Please try again.';
        
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false,
        volunteer: null
      }));

      throw new Error(errorMessage);
    }
  };

  return {
    registerVolunteer,
    ...state
  };
}