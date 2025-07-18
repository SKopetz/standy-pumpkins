import React from 'react';
import { FormInput } from '../ui/FormInput';
import { PhoneInput } from '../ui/PhoneInput';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { SMSPreference } from '../volunteer/SMSPreference';
import { useSignUpForm } from '../../hooks/useSignUpForm';
import { SignUpConfirmation } from './SignUpConfirmation';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const {
    formData,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    handleSMSPreferenceChange,
    message,
    error,
    isSubmitting,
    profile,
    showConfirmation
  } = useSignUpForm();

  if (showConfirmation && profile) {
    return (
      <SignUpConfirmation
        profile={profile}
        onClose={() => {
          if (onSuccess) onSuccess();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            type="text"
            id="firstName"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <FormInput
            type="text"
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <FormInput
          type="email"
          id="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <PhoneInput
          label="Phone Number"
          value={formData.phone}
          onChange={handlePhoneChange}
          required
          disabled={isSubmitting}
        />

        <SMSPreference
          checked={formData.smspreference}
          onChange={handleSMSPreferenceChange}
          disabled={isSubmitting}
        />

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}

        <Button type="submit" loading={isSubmitting}>
          Create Account
        </Button>
      </form>
    </div>
  );
}