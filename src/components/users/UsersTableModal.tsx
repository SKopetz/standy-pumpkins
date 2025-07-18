import React, { useState } from 'react';
import { X, Plus, RefreshCw } from 'lucide-react';
import { UsersTable } from './UsersTable';
import { AddUserModal } from './AddUserModal';
import { Button } from '../ui/Button';

interface UsersTableModalProps {
  onClose: () => void;
}

export function UsersTableModal({ onClose }: UsersTableModalProps) {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUserAdded = async () => {
    setShowAddUserModal(false);
    handleRefresh();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
      <div className="p-4 border-b border-dark/10 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-dark">Manage Users</h2>
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
            onClick={() => setShowAddUserModal(true)}
            className="!w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
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
        <UsersTable key={refreshTrigger} />
      </div>

      {showAddUserModal && (
        <AddUserModal onClose={handleUserAdded} />
      )}
    </div>
  );
}