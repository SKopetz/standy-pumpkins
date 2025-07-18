import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { saveProfile, getProfile, clearProfile } from '../lib/auth/storage';
import type { AuthState, ProfileFormData } from '../lib/auth/types';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    profile: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Initial profile load
    const storedProfile = getProfile();
    setState(prev => ({ 
      ...prev, 
      profile: storedProfile,
      loading: false 
    }));

    // Listen for auth state changes
    const handleAuthChange = () => {
      const profile = getProfile();
      setState(prev => ({
        ...prev,
        profile,
        loading: false
      }));
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  async function signIn(email: string) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data: profile, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      if (supabaseError) throw supabaseError;
      if (!profile) {
        throw new Error('No account found with this email. Please sign up first.');
      }

      saveProfile(profile);
      setState({ profile, loading: false, error: null });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      return false;
    }
  }

  async function signUp(profileData: ProfileFormData) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Check if email already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', profileData.email.toLowerCase())
        .maybeSingle();

      if (existingProfile) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert([{ ...profileData, email: profileData.email.toLowerCase() }])
        .select()
        .single();

      if (error) throw error;

      saveProfile(profile);
      setState({ profile, loading: false, error: null });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      return false;
    }
  }

  function signOut() {
    clearProfile();
    setState({ profile: null, loading: false, error: null });
  }

  return {
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    signIn,
    signUp,
    signOut
  };
}