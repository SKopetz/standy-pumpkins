import React from 'react';
import { AlertDialog } from '../ui/AlertDialog';
import { useDeleteUser } from '../../hooks/useDeleteUser';
import type { Profile } from '../../types/profile.types';

interface DeleteUserDialogProps {
  user: Profile;
  isOpen: boolean;
  onClose: () => Promise<void>;
}

export function DeleteUserDialog({ user, isOpen, onClose }: DeleteUserDialogProps) {
  const { deleteUser, loading } = useDeleteUser(onClose);

  return (
    <AlertDialog
      isOpen={isOpen}
      title="Delete User"
      message={`Are you sure you want to delete ${user.firstName} ${user.lastName}'s account? This action cannot be undone.`}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onConfirm={() => deleteUser(user.id)}
      onCancel={onClose}
      loading={loading}
    />
  );
}