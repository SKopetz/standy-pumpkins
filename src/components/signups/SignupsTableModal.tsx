import React from 'react';
import { X, RefreshCw } from 'lucide-react';
import { SignupsTable } from './SignupsTable';
import { Button } from '../ui/Button';

interface SignupsTableModalProps {
  onClose: () => void;
}

export function SignupsTableModal({ onClose }: SignupsTableModalProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl w-full h-full">
      <div className="p-4 border-b border-dark/10 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-dark">Manage Sign Ups</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
            className="!w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
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
        <SignupsTable />
      </div>
    </div>
  );
}