import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface UserActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function UserActions({ onEdit, onDelete }: UserActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        className="!p-2 !w-auto"
        onClick={onEdit}
        title="Edit user"
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        className="!p-2 !w-auto hover:!bg-red-600"
        onClick={onDelete}
        title="Delete user"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}