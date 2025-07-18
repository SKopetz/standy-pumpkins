import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { MyEventsModal } from './MyEventsModal';
import { Button } from '../ui/Button';

export function MyEventsButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        className="!w-auto"
        onClick={() => setShowModal(true)}
      >
        <Calendar className="w-4 h-4" />
        My Events
      </Button>

      {showModal && (
        <MyEventsModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}