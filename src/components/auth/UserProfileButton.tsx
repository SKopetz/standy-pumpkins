import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { EditUserModal } from '../users/EditUserModal';

export function UserProfileButton() {
  const { profile } = useAuthContext();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!profile) return null;

  return (
    <>
      <button
        onClick={() => setShowEditModal(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-light/80 hover:text-light hover:bg-dark-hover rounded-md transition-colors"
      >
        <User className="w-4 h-4" />
        <span>{profile.firstName} {profile.lastName}</span>
      </button>

      {showEditModal && (
        <EditUserModal
          user={profile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}