import React from 'react';
import { Calendar } from 'lucide-react';
import { Event } from '../../types/event.types';
import { formatEventDate } from '../../utils/dateUtils';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">{event.title}</h2>
      </div>
      
      {event.description && (
        <p className="text-gray-600 mb-4">{event.description}</p>
      )}
      
      <div className="text-sm text-gray-500">
        {formatEventDate(event.eventDate)}
      </div>
    </div>
  );
}