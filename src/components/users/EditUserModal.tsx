import React from 'react';
import { X } from 'lucide-react';
import { useEditUser } from '../../hooks/useEditUser';
import { FormInput } from '../ui/FormInput';
import { PhoneInput } from '../ui/PhoneInput';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { SMSPreference } from '../volunteer/SMSPreference';
import type { Profile } from '../../types/profile.types';
import { useAuthContext } from '../../contexts/AuthContext';

interface EditUserModalProps {
  user: Profile;
  onClose: () => Promise<void>;
}

export function EditUserModal({ user, onClose }: EditUserModalProps) {
  const { profile: currentUser } = useAuthContext();
  const isAdmin = currentUser?.user_type === 'admin';
  const {
    formData,
    handleChange,
    handlePhoneChange,
    handleSMSPreferenceChange,
    handleSubmit,
    loading,
    error
  } = useEditUser(user, onClose);

  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-dark/10">
          <h2 className="text-xl font-semibold text-dark">Edit User</h2>
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
            <label className="text-sm font-medium text-dark/80">
              Role:
            </label>
            {isAdmin ? (
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
            ) : (
              <span className="px-3 py-2 text-dark/70 capitalize">
                {formData.user_type}
              </span>
            )}
          </div>

          <SMSPreference
            checked={formData.smspreference}
            onChange={handleSMSPreferenceChange}
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