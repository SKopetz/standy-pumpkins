import React, { useState } from 'react';
import { X, Plus, RefreshCw } from 'lucide-react';
import { EventsTable } from './EventsTable';
import { NewEventModal } from './NewEventModal';
import { Button } from '../ui/Button';

interface EventsTableModalProps {
  onClose: () => void;
}

export function EventsTableModal({ onClose }: EventsTableModalProps) {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full h-full">
      <div className="p-4 border-b border-dark/10 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-dark">Manage Events</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={handleRefresh}
            className="!w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => setShowNewEventModal(true)}
            className="!w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
          <button
            onClick={onClose}
            className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <EventsTable key={refreshTrigger} />
      </div>

      {showNewEventModal && (
        <NewEventModal onClose={() => {
          setShowNewEventModal(false);
          handleRefresh();
        }} />
      )}
    </div>
  );
}