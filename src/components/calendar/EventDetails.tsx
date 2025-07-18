import React, { useState } from 'react';
import { X, Calendar, Clock, Users } from 'lucide-react';
import { Event } from '../../types/calendar.types';
import { formatEventDate, formatTime } from '../../utils/dateUtils';
import { VolunteerForm } from '../volunteer/VolunteerForm';
import { AdminVolunteerForm } from '../volunteer/AdminVolunteerForm';
import { VolunteerActions } from '../volunteer/VolunteerActions';
import { Button } from '../ui/Button';
import { useVolunteers } from '../../hooks/useVolunteers';
import { useVolunteerStatus } from '../../hooks/useVolunteerStatus';
import { useAuthContext } from '../../contexts/AuthContext';
import { useVolunteerRegistration } from '../../hooks/useVolunteerRegistration';
import { useEventVolunteers } from '../../hooks/useEventVolunteers';

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
  isModal?: boolean;
}

export function EventDetails({ event, onClose, isModal = true }: EventDetailsProps) {
  const { profile } = useAuthContext();
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const { registerVolunteer } = useVolunteerRegistration(event);
  const { volunteerCount, loading: countLoading } = useVolunteers(event.id);
  const { 
    volunteer, 
    loading: statusLoading, 
    cancelVolunteer 
  } = useVolunteerStatus(event.id, profile?.email || null);
  const { volunteers, loading: volunteersLoading } = useEventVolunteers(event.id);
  
  const containerClass = isModal
    ? 'fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4'
    : 'fixed inset-0 bg-white z-50';

  const contentClass = isModal
    ? 'bg-white rounded-lg shadow-xl w-full max-w-lg'
    : 'w-full h-full overflow-auto';

  const categoryColors = {
    Patch: 'bg-blue-100 text-blue-800',
    Closing: 'bg-purple-100 text-purple-800',
    Staff: 'bg-green-100 text-green-800',
    Other: 'bg-orange-100 text-orange-800'
  };

  const categoryColor = categoryColors[event.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
  
  const spotsRemaining = event.capacity ? event.capacity - (volunteerCount || 0) : null;
  const isFull = spotsRemaining !== null && spotsRemaining <= 0;
  
  // Check if event is in the past
  const isPastEvent = new Date(event.eventDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const handleEditVolunteer = () => {
    setShowVolunteerForm(true);
  };

  const handleAdminRegistration = async (userData: any) => {
    try {
      await registerVolunteer({
        ...userData
      });
      onClose();
    } catch (err) {
      console.error('Registration attempt failed:', err);
      throw err;
    }
  };

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        <div className="flex justify-between items-start p-4 border-b border-dark/10">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-dark">{event.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}>
              {event.category}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {showVolunteerForm ? (
            <VolunteerForm
              event={event}
              onClose={onClose}
              existingVolunteer={volunteer}
            />
          ) : (
            <>
              {event.description && (
                <p className="text-dark/80">{event.description}</p>
              )}
              
              <div className="flex items-center gap-2 text-dark/70">
                <Calendar className="w-5 h-5" />
                <span>{formatEventDate(event.eventDate)}</span>
              </div>
              
              {event.startTime && event.endTime && (
                <div className="flex items-center gap-2 text-dark/70">
                  <Clock className="w-5 h-5" />
                  <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                </div>
              )}
              
              {event.capacity && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-dark/70">
                    <Users className="w-5 h-5" />
                    <span>
                      {countLoading ? (
                        'Loading...'
                      ) : (
                        `${volunteerCount || 0} / ${event.capacity} volunteers registered`
                      )}
                    </span>
                  </div>

                  <div className="pl-7">
                    {volunteersLoading ? (
                      <div className="text-sm text-dark/60">Loading volunteers...</div>
                    ) : volunteers.length > 0 ? (
                      <div className="text-sm space-y-1">
                        {volunteers.map((volunteer, index) => (
                          <div key={index} className="text-dark/70">
                            {volunteer.first_name} {volunteer.last_name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-dark/60">No volunteers yet</div>
                    )}
                  </div>
                </div>
              )}

              {statusLoading ? (
                <div className="text-center text-dark/70">Loading...</div>
              ) : volunteer ? (
                <VolunteerActions
                  event={event}
                  volunteer={volunteer}
                  onEdit={handleEditVolunteer}
                  onCancel={cancelVolunteer}
                  onClose={onClose}
                />
              ) : showAdminForm ? (
                <AdminVolunteerForm
                  event={event}
                  onClose={() => setShowAdminForm(false)}
                  onSuccess={handleAdminRegistration}
                />
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowVolunteerForm(true)}
                    disabled={isFull || isPastEvent}
                    className="w-full"
                  >
                    {isPastEvent ? 'Event Has Passed' : isFull ? 'Event Full' : 'Volunteer Now'}
                  </Button>
                  {profile?.user_type === 'admin' && !isPastEvent && !isFull && (
                    <Button
                      variant="secondary"
                      onClick={() => setShowAdminForm(true)}
                      className="w-full"
                    >
                      Sign Up Someone Else
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}