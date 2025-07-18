import React from 'react';
import { FormInput } from '../ui/FormInput';
import { PhoneInput } from '../ui/PhoneInput';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { VolunteerConfirmation } from './VolunteerConfirmation';
import { useVolunteerRegistration } from '../../hooks/useVolunteerRegistration';
import { useVolunteerFormData } from '../../hooks/useVolunteerFormData';
import { useVolunteerCount } from '../../hooks/useVolunteerCount';
import { checkEventCapacity } from '../../utils/volunteerUtils';
import type { Event } from '../../types/calendar.types';
import type { Volunteer } from '../../types/volunteer.types';

interface VolunteerFormProps {
  event: Event;
  onClose: () => void;
  existingVolunteer?: Volunteer | null;
}

export function VolunteerForm({ event, onClose, existingVolunteer }: VolunteerFormProps) {
  const { formData, handleChange, handlePhoneChange } = useVolunteerFormData(existingVolunteer);
  const { registerVolunteer, loading, error: registrationError, success, volunteer } = useVolunteerRegistration(event);
  const volunteerCount = useVolunteerCount(existingVolunteer?.group_size || 1);
  const [capacityError, setCapacityError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCapacityError(null);

    if (!volunteerCount.validate()) {
      return;
    }

    try {
      if (event.capacity) {
        const capacityCheck = await checkEventCapacity(
          event.id,
          volunteerCount.parsedValue,
          existingVolunteer,
          event.capacity
        );

        if (!capacityCheck.allowed) {
          setCapacityError(capacityCheck.error);
          return;
        }
      }

      await registerVolunteer({
        ...formData,
        groupSize: volunteerCount.parsedValue
      });
    } catch (err) {
      console.error('Registration attempt failed:', err);
    }
  };

  if (success && volunteer) {
    return (
      <VolunteerConfirmation
        eventId={event.id}
        groupSize={volunteer.group_size}
        phone={formData.phone}
        onClose={onClose}
      />
    );
  }

  const error = capacityError || registrationError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <FormInput
        label="Number of Volunteers"
        type="text"
        name="groupSize"
        value={volunteerCount.value}
        onChange={(e) => volunteerCount.handleChange(e.target.value)}
        required
        disabled={loading}
        error={volunteerCount.error}
      />

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex gap-4">
        <Button type="submit" loading={loading}>
          {existingVolunteer ? 'Update' : 'Register'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}