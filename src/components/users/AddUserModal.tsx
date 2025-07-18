import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { FormInput } from '../ui/FormInput';
import { PhoneInput } from '../ui/PhoneInput';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { SMSPreference } from '../volunteer/SMSPreference';

interface AddUserModalProps {
  onClose: () => void;
}

export function AddUserModal({ onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    user_type: 'user',
    smspreference: true
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
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        throw new Error('A user with this email already exists');
      }

      // Create new user
      const { error: createError } = await supabase
        .from('profiles')
        .insert([{
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          user_type: formData.user_type,
          smspreference: formData.smspreference
        }]);

      if (createError) throw createError;
      onClose();
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-dark/10">
          <h2 className="text-xl font-semibold text-dark">Add New User</h2>
          <button
            onClick={onClose}
            className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <FormInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <PhoneInput
            label="Phone Number"
            value={formData.phone}
            onChange={handlePhoneChange}
            required
            disabled={loading}
          />

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-dark/80">Role:</label>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              className="px-3 py-2 rounded-md border border-dark/10 bg-white text-dark"
              disabled={loading}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <SMSPreference
            checked={formData.smspreference}
            onChange={handleSMSPreferenceChange}
            disabled={loading}
          />

          {error && <Alert variant="error">{error}</Alert>}

          <div className="flex gap-4">
            <Button type="submit" loading={loading}>
              Create User
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}