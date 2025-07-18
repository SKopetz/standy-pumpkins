import React from 'react';
import { AlertDialog } from '../ui/AlertDialog';
import { useDeleteEvent } from '../../hooks/useDeleteEvent';
import type { Event } from '../../types/calendar.types';

interface DeleteEventDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteEventDialog({ event, isOpen, onClose }: DeleteEventDialogProps) {
  const { deleteEvent, loading, error } = useDeleteEvent(onClose);

  return (
    <AlertDialog
      isOpen={isOpen}
      title="Delete Event"
      message={
        error || 
        `Are you sure you want to delete "${event.title}"? This action cannot be undone.`
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onConfirm={() => deleteEvent(event.id)}
      onCancel={onClose}
      loading={loading}
    />
  );
}