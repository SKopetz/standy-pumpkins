import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useKioskContext } from '../../contexts/KioskContext';
import { UserProfileButton } from '../auth/UserProfileButton';
import { AuthButton } from '../auth/AuthButton';
import { MyEventsButton } from '../events/MyEventsButton';
import { KioskHeader } from '../kiosk/KioskHeader';

export function Header() {
  const { profile } = useAuthContext();
  const { isKioskMode } = useKioskContext();

  if (isKioskMode) {
    return <KioskHeader />;
  }

  return (
    <header className="bg-dark text-light shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold leading-tight">
              St. Andrew's Episcopal Church
            </h1>
            <p className="text-sm sm:text-base mt-1 text-light/80">
              Pumpkin Patch Volunteers
            </p>
          </div>
          <div className="flex items-center gap-4">
            {profile?.user_type === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-light/80 hover:text-light hover:bg-dark-hover rounded-md transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            {profile && <UserProfileButton />}
            {profile && <MyEventsButton />}
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}