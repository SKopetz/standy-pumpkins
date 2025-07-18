import React, { memo } from 'react';
import type { Event } from '../../types/calendar.types';
import { useVolunteers } from '../../hooks/useVolunteers';
import { useAuthContext } from '../../contexts/AuthContext';

interface EventBadgeProps {
  event: Event;
  onClick: () => void;
  onSignInRequired: () => void;
}

export const EventBadge = memo(function EventBadge({ event, onClick, onSignInRequired }: EventBadgeProps) {
  const { profile } = useAuthContext();
  const { volunteerCount, loading, error } = useVolunteers(event.id);
  const isFull = event.capacity && volunteerCount >= event.capacity;
  
  const categoryColors = {
    Other: {
      default: 'bg-blue-100 text-blue-800',
      full: 'bg-blue-50/50 text-blue-800/50'
    },
    Closing: {
      default: 'bg-purple-100 text-purple-800',
      full: 'bg-purple-50/50 text-purple-800/50'
    },
    Staff: {
      default: 'bg-green-100 text-green-800',
      full: 'bg-green-50/50 text-green-800/50'
    },
    Patch: {
      default: 'bg-orange-100 text-orange-800',
      full: 'bg-orange-50/50 text-orange-800/50'
    }
  };

  const colors = categoryColors[event.category as keyof typeof categoryColors] || {
    default: 'bg-gray-100 text-gray-800',
    full: 'bg-gray-50/50 text-gray-800/50'
  };

  const color = isFull ? colors.full : colors.default;

  if (error) {
    console.error('Error loading volunteer count:', error);
  }

  return (
    <button 
      onClick={() => profile ? onClick() : onSignInRequired()}
      className={`
        w-full text-left text-xs px-2 py-1 rounded 
        ${color} truncate hover:opacity-80 transition-opacity
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50
        ${loading ? 'animate-pulse' : ''}
      `}
      title={`${event.title}${isFull ? ' (Full)' : ''}`}
      disabled={loading}
    >
      <div className="flex justify-between items-center">
        <span className="truncate">{event.title}</span>
        {event.capacity && (
          <span className="ml-1 whitespace-nowrap">
            {loading ? '...' : `(${volunteerCount}/${event.capacity})`}
          </span>
        )}
      </div>
    </button>
  );
});