import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useSupabaseConnection } from './hooks/useSupabaseConnection';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ConnectionError } from './components/ui/ConnectionError';
import { Header } from './components/layout/Header';
import { VolunteerCalendar } from './components/calendar/VolunteerCalendar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EventsTableModal } from './components/events/EventsTableModal';
import { UsersTableModal } from './components/users/UsersTableModal';
import { SignupsTableModal } from './components/signups/SignupsTableModal';
import { NotificationsTableModal } from './components/notifications/NotificationsTableModal';
import { ContactVolunteers } from './components/admin/ContactVolunteers';
import { UpcomingVolunteersModal } from './components/admin/UpcomingVolunteersModal';
import { UpcomingOpenShiftsModal } from './components/admin/UpcomingOpenShiftsModal';
import { AdminRoute } from './components/admin/AdminRoute';

export default function App() {
  const { loading: authLoading } = useAuth();
  const { isConnected, error: connectionError } = useSupabaseConnection();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <ConnectionError message={connectionError || undefined} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-light">
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={
              <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <VolunteerCalendar />
              </main>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                  <AdminDashboard />
                </main>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <AdminRoute>
                <main className="w-full px-4 py-8">
                  <EventsTableModal onClose={() => window.history.back()} />
                </main>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                  <UsersTableModal onClose={() => window.history.back()} />
                </main>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/signups" 
            element={
              <AdminRoute>
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                  <SignupsTableModal onClose={() => window.history.back()} />
                </main>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/notifications" 
            element={
              <AdminRoute>
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                  <NotificationsTableModal onClose={() => window.history.back()} />
                </main>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/upcoming" 
            element={
              <AdminRoute>
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                  <UpcomingVolunteersModal onClose={() => window.history.back()} />
                </main>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/open-shifts" 
            element={
              <AdminRoute>
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                  <UpcomingOpenShiftsModal onClose={() => window.history.back()} />
                </main>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/contact" 
            element={
              <AdminRoute>
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                  <ContactVolunteers />
                </main>
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}