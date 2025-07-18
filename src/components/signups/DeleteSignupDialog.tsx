import React from 'react';
import { AlertDialog } from '../ui/AlertDialog';
import { useSignupManagement } from '../../hooks/useSignupManagement';
import type { VolunteerWithEvent } from '../../types/volunteer.types';

interface DeleteSignupDialogProps {
  signup: VolunteerWithEvent;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteSignupDialog({ signup, isOpen, onClose }: DeleteSignupDialogProps) {
  const { deleteSignup, loading, error } = useSignupManagement();

  const handleDelete = async () => {
    try {
      await deleteSignup(signup.id);
      onClose();
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to delete signup:', err);
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      title="Delete Sign Up"
      message={
        error || 
        `Are you sure you want to delete the sign up for ${signup.first_name} ${signup.last_name}? This action cannot be undone.`
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onConfirm={handleDelete}
      onCancel={onClose}
      loading={loading}
    />
  );
}