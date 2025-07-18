import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Event } from '../../types/calendar.types';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { Button } from '../ui/Button';
import { sendImmediateConfirmation } from '../../lib/notifications/immediateNotification';
import { Alert } from '../ui/Alert';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface VolunteerConfirmationProps {
  eventId: string;
  groupSize: number;
  phone: string;
  onClose: () => void;
}

export function VolunteerConfirmation({ eventId, groupSize, phone, onClose }: VolunteerConfirmationProps) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSendText = async () => {
    try {
      setSending(true);
      setError(null);
      await sendImmediateConfirmation(phone, eventId);
      onClose();
    } catch (err) {
      setError('Failed to send text message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center text-primary">
        <div className="rounded-full bg-primary/10 p-3">
          <Check className="w-8 h-8" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold text-dark mb-2">
          Registration Confirmed!
        </h3>
        <p className="text-dark/70">
          Thank you for volunteering{groupSize > 1 ? ` with ${groupSize} people` : ''}!
        </p>
      </div>

      <div className="bg-light rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-dark">{event?.title}</h4>
        
        <div className="flex items-center gap-2 text-dark/70">
          <Calendar className="w-4 h-4" />
          <span>{event?.eventDate ? formatDate(event.eventDate) : ''}</span>
        </div>
        
        {event?.startTime && event?.endTime && (
          <div className="flex items-center gap-2 text-dark/70">
            <Clock className="w-4 h-4" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-dark/70">
          <Users className="w-4 h-4" />
          <span>{groupSize} volunteer{groupSize > 1 ? 's' : ''} registered</span>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="space-y-3">
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleSendText} 
          loading={sending}
          className="w-full"
        >
          Send me details by text
        </Button>
      </div>
    </div>
  );
}