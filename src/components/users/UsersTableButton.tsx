import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { UsersTableModal } from './UsersTableModal';
import { Button } from '../ui/Button';

export function UsersTableButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        className="!w-auto"
        onClick={() => setShowModal(true)}
      >
        <Users className="w-4 h-4" />
        View Users
      </Button>

      {showModal && (
        <UsersTableModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}