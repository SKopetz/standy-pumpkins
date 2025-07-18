import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSignupManagement } from '../../hooks/useSignupManagement';
import { FormInput } from '../ui/FormInput';
import { PhoneInput } from '../ui/PhoneInput';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import type { VolunteerWithEvent } from '../../types/volunteer.types';

interface EditSignupModalProps {
  signup: VolunteerWithEvent;
  onClose: () => void;
}

export function EditSignupModal({ signup, onClose }: EditSignupModalProps) {
  const { updateSignup, loading, error } = useSignupManagement();
  const [formData, setFormData] = useState({
    first_name: signup.first_name,
    last_name: signup.last_name,
    email: signup.email,
    phone: signup.phone,
    group_size: signup.group_size
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'group_size' 
      ? Math.max(1, parseInt(e.target.value) || 1)
      : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSignup(signup.id, formData);
      onClose();
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to update signup:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-dark/10">
          <h2 className="text-xl font-semibold text-dark">Edit Sign Up</h2>
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
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <FormInput
              label="Last Name"
              name="last_name"
              value={formData.last_name}
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

          <FormInput
            label="Group Size"
            type="number"
            name="group_size"
            value={formData.group_size}
            onChange={handleChange}
            min={1}
            required
            disabled={loading}
          />

          {error && <Alert variant="error">{error}</Alert>}

          <div className="flex gap-4">
            <Button type="submit" loading={loading}>
              Save Changes
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