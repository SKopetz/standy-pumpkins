import type { Volunteer } from '../types/volunteer.types';

interface CapacityCheck {
  allowed: boolean;
  currentTotal: number;
  requestedTotal: number;
  capacity: number;
  availableSpots: number;
  error?: string;
}

export function validateCapacityChange(
  requestedSize: number,
  currentTotal: number,
  capacity: number,
  existingVolunteer?: Volunteer | null
): CapacityCheck {
  // Subtract existing volunteer's group size from total if updating
  const otherVolunteersTotal = existingVolunteer 
    ? currentTotal - existingVolunteer.group_size 
    : currentTotal;

  const requestedTotal = otherVolunteersTotal + requestedSize;
  const availableSpots = capacity - otherVolunteersTotal;

  return {
    allowed: requestedTotal <= capacity,
    currentTotal: otherVolunteersTotal,
    requestedTotal,
    capacity,
    availableSpots,
    error: requestedTotal > capacity
      ? formatCapacityError(requestedSize, otherVolunteersTotal, capacity, availableSpots)
      : undefined
  };
}

export function formatCapacityError(
  requested: number,
  current: number,
  capacity: number,
  available: number
): string {
  if (available === 0) {
    return `This event is already at full capacity (${capacity} volunteers).`;
  }

  if (available === 1) {
    return `Only 1 spot remaining. Cannot register ${requested} volunteers.`;
  }

  return `Cannot register ${requested} volunteers. The event capacity is ${capacity}, with ${current} spots already taken. Only ${available} spots remaining.`;
}