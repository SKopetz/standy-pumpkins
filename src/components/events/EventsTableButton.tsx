import React, { useState } from 'react';
import { Table } from 'lucide-react';
import { EventsTableModal } from './EventsTableModal';
import { Button } from '../ui/Button';

export function EventsTableButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        className="!w-auto"
        onClick={() => setShowModal(true)}
      >
        <Table className="w-4 h-4" />
        View All Events
      </Button>

      {showModal && (
        <EventsTableModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}