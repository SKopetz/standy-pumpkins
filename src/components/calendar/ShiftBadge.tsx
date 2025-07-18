import React from 'react';
import type { Shift } from '../../types/calendar.types';

interface ShiftBadgeProps {
  shift: Shift;
}

export function ShiftBadge({ shift }: ShiftBadgeProps) {
  const categoryColors = {
    Worship: 'bg-blue-100 text-blue-800',
    Service: 'bg-green-100 text-green-800',
    Education: 'bg-purple-100 text-purple-800',
    Support: 'bg-orange-100 text-orange-800'
  };

  const color = categoryColors[shift.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';

  return (
    <div className={`text-xs px-2 py-1 rounded ${color} truncate`}>
      {shift.title}
    </div>
  );
}