import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useEventsTable } from '../../hooks/useEventsTable';
import { EventActions } from './EventActions';
import { EditEventModal } from './EditEventModal';
import { DeleteEventDialog } from './DeleteEventDialog';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { formatEventDate as formatDate, formatTime } from '../../utils/dateUtils';
import type { Event } from '../../types/calendar.types';

type SortField = 'title' | 'date' | 'time' | 'category' | 'capacity';
type SortDirection = 'asc' | 'desc';

interface SortableColumnProps {
  label: string;
  field: SortField;
  currentSort: SortField | null;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

function SortableColumn({ label, field, currentSort, direction, onSort }: SortableColumnProps) {
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 px-4 py-2 text-left text-dark/70 font-medium hover:text-dark group"
    >
      {label}
      <span className="text-dark/40 group-hover:text-dark">
        {currentSort === field ? (
          direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
        ) : (
          <ArrowUpDown className="w-4 h-4" />
        )}
      </span>
    </button>
  );
}

export function EventsTable() {
  const { events, isLoading, error } = useEventsTable();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEvents = useMemo(() => {
    if (!sortField) return events;

    return [...events].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
          break;
        case 'time':
          const aTime = a.startTime || '';
          const bTime = b.startTime || '';
          comparison = aTime.localeCompare(bTime);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'capacity':
          const aCapacity = a.capacity || 0;
          const bCapacity = b.capacity || 0;
          comparison = aCapacity - bCapacity;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [events, sortField, sortDirection]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading events: {error}</div>;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-light">
              <th>
                <SortableColumn
                  label="Title"
                  field="title"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th>
                <SortableColumn
                  label="Date"
                  field="date"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th>
                <SortableColumn
                  label="Time"
                  field="time"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th>
                <SortableColumn
                  label="Category"
                  field="category"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th>
                <SortableColumn
                  label="Capacity"
                  field="capacity"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-2 text-left text-dark/70 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/10">
            {sortedEvents.map(event => (
              <tr key={event.id} className="hover:bg-light/50">
                <td className="px-4 py-2">
                  <div>
                    <div className="font-medium text-dark">{event.title}</div>
                    {event.description && (
                      <div className="text-sm text-dark/70">{event.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-dark whitespace-nowrap">
                  {formatDate(event.eventDate)}
                </td>
                <td className="px-4 py-2 text-dark whitespace-nowrap">
                  {event.startTime && event.endTime ? (
                    `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
                  ) : (
                    <span className="text-dark/40">No time set</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-sm rounded-full bg-light">
                    {event.category}
                  </span>
                </td>
                <td className="px-4 py-2 text-dark">
                  {event.capacity || 'Unlimited'}
                </td>
                <td className="px-4 py-2">
                  <EventActions
                    onEdit={() => setEditingEvent(event)}
                    onDelete={() => setDeletingEvent(event)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {deletingEvent && (
        <DeleteEventDialog
          event={deletingEvent}
          isOpen={true}
          onClose={() => setDeletingEvent(null)}
        />
      )}
    </>
  );
}