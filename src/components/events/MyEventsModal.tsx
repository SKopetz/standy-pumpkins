import React from 'react';
import { X } from 'lucide-react';
import { MyEventsList } from './MyEventsList';
import { InfoBanner } from '../ui/InfoBanner';

interface MyEventsModalProps {
  onClose: () => void;
}

export function MyEventsModal({ onClose }: MyEventsModalProps) {
  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-dark/10">
          <h2 className="text-xl font-semibold text-dark">My Upcoming Events</h2>
          <button
            onClick={onClose}
            className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="mb-4">
            <InfoBanner message="Select the event to edit or cancel" />
          </div>
          <MyEventsList />
        </div>
      </div>
    </div>
  );
}