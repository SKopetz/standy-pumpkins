import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase/client';
import type { ProfileFormData, AuthProfile } from '../lib/auth/types';

export function useSignUpForm() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    user_type: 'user',
    smspreference: true
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null); // Clear any previous errors
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleSMSPreferenceChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      smspreference: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError(null);
    setIsSubmitting(true);

    try {
      // Check if email already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email.toLowerCase())
        .maybeSingle();

      if (existingProfile) {
        setError('This email address is already registered. Please try to sign in.');
        setIsSubmitting(false);
        return;
      }

      const success = await signUp(formData);
      if (success) {
        setProfile({
          id: crypto.randomUUID(),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          created_at: new Date().toISOString(),
          user_type: 'user',
          smspreference: formData.smspreference
        });
        setShowConfirmation(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      user_type: 'user',
      smspreference: true
    });
  };

  return {
    formData,
    handleChange,
    handlePhoneChange,
    handleSMSPreferenceChange,
    handleSubmit,
    message,
    error,
    isSubmitting,
    profile,
    showConfirmation,
    closeConfirmation
  };
}