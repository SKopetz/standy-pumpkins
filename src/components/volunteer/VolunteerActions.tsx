import React, { useState } from 'react';
import { AlertDialog } from '../ui/AlertDialog';
import { Button } from '../ui/Button';
import { isLastMinuteCancellation } from '../../utils/dateUtils';
import type { Event } from '../../types/calendar.types';
import type { Volunteer } from '../../types/volunteer.types';

interface VolunteerActionsProps {
  event: Event;
  volunteer: Volunteer;
  onEdit: () => void;
  onCancel: () => Promise<void>;
  onClose: () => void;
}

export function VolunteerActions({ event, volunteer, onEdit, onCancel, onClose }: VolunteerActionsProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLastMinuteWarning, setShowLastMinuteWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelClick = () => {
    if (isLastMinuteCancellation(event.eventDate)) {
      setShowLastMinuteWarning(true);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError(null);

      await onCancel();
      setShowConfirmation(false);
      setShowLastMinuteWarning(false);
      onClose();
    } catch (error) {
      console.error('Failed to cancel registration:', error);
      setError('Failed to cancel registration. Please try again or contact support if the problem persists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-4">
        <Button onClick={onEdit}>
          Edit Sign Up
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleCancelClick}
        >
          Cancel Sign Up
        </Button>
      </div>
      
      {error && (
        <div className="mt-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <AlertDialog
        isOpen={showLastMinuteWarning}
        title="Last Minute Cancellation"
        message="We understand that last minute conflicts come up. Please contact the church office at (281) 485-3843 so that a replacement can be found. If after hours or the weekend, please leave a message."
        confirmLabel="Continue with Cancellation"
        cancelLabel="Keep Registration"
        onConfirm={() => {
          setShowLastMinuteWarning(false);
          setShowConfirmation(true);
        }}
        onCancel={() => setShowLastMinuteWarning(false)}
        loading={loading}
      />

      <AlertDialog
        isOpen={showConfirmation}
        title="Cancel Registration"
        message="Are you sure you want to cancel your registration for this event?"
        confirmLabel="Yes, Cancel"
        cancelLabel="No, Keep"
        onConfirm={handleCancel}
        onCancel={() => setShowConfirmation(false)}
        loading={loading}
      />
    </>
  );
}