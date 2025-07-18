import React from 'react';
import { Check, Mail, Phone, UserCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import type { AuthProfile } from '../../lib/auth/types';

interface SignUpConfirmationProps {
  profile: AuthProfile;
  onClose: () => void;
}

export function SignUpConfirmation({ profile, onClose }: SignUpConfirmationProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center text-primary">
        <div className="rounded-full bg-primary/10 p-3">
          <Check className="w-8 h-8" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold text-dark mb-2">
          Welcome to St. Andrew's Volunteer App!
        </h3>
        <p className="text-dark/70">
          Your account has been created successfully.
        </p>
      </div>

      <div className="bg-light rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-dark">
          <UserCircle className="w-5 h-5 text-primary" />
          <span className="font-medium">
            {profile.firstName} {profile.lastName}
          </span>
        </div>

        <div className="flex items-center gap-2 text-dark/70">
          <Mail className="w-5 h-5" />
          <span>{profile.email}</span>
        </div>

        {profile.phone && (
          <div className="flex items-center gap-2 text-dark/70">
            <Phone className="w-5 h-5" />
            <span>{profile.phone}</span>
          </div>
        )}
      </div>

      <Button onClick={onClose} className="w-full">
        Start Volunteering
      </Button>
    </div>
  );
}