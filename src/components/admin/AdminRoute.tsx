import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { profile, loading } = useAuthContext();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}