import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile.types';
import type { OnCloseFunction } from '../types/modal.types';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  user_type: 'user' | 'admin';
  smspreference: boolean;
}

export function useEditUser(user: Profile, onClose: OnCloseFunction) {
  const [formData, setFormData] = useState<FormData>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    user_type: user.user_type,
    smspreference: user.smspreference ?? true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSMSPreferenceChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, smspreference: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          user_type: formData.user_type,
          smspreference: formData.smspreference
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      await onClose();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handlePhoneChange,
    handleSMSPreferenceChange,
    handleSubmit,
    loading,
    error
  };
}