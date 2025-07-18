import React from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

interface AuthModalProps {
  onSuccess?: () => void;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ onSuccess, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = React.useState(initialMode === 'signin');

  return (
    <div className="bg-light p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-dark text-center mb-6">
        {isSignIn ? 'Sign In' : 'Create Account'}
      </h2>
      
      {isSignIn ? (
        <SignInForm 
          onSuccess={onSuccess} 
          onSwitchToSignUp={() => setIsSignIn(false)}
          onClose={onClose}
        />
      ) : (
        <SignUpForm onSuccess={onSuccess} />
      )}
    </div>
  );
}