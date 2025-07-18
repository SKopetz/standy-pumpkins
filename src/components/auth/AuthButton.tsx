import React, { useState } from 'react';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { AuthModal } from './AuthModal';

export function AuthButton() {
  const { profile, signOut, loading } = useAuthContext();
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <button 
        disabled
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-dark/50 bg-light/10 rounded-md"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    );
  }

  if (profile) {
    return (
      <button
        onClick={signOut}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-light bg-secondary hover:bg-secondary-hover rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-dark bg-primary hover:bg-primary-hover rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        data-signin-button="true"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50">
          <div className="relative bg-light rounded-lg shadow-xl">
            <button
              onClick={handleCloseModal}
              className="absolute -top-2 -right-2 rounded-full bg-light hover:bg-light-hover p-1 transition-colors focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <AuthModal 
              onSuccess={handleCloseModal} 
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </>
  );
}