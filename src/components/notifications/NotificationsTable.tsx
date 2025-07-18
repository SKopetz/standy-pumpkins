import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { formatDateTime } from '../../utils/dateUtils';

type SortField = 'name' | 'phone' | 'message' | 'scheduled';
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

export function NotificationsTable() {
  const { notifications, isLoading, error } = useNotifications();
  const [sortField, setSortField] = useState<SortField>('scheduled');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedNotifications = useMemo(() => {
    if (!sortField) return notifications;

    return [...notifications].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = `${a.volunteer.first_name} ${a.volunteer.last_name}`.localeCompare(
            `${b.volunteer.first_name} ${b.volunteer.last_name}`
          );
          break;
        case 'phone':
          comparison = (a.volunteer.phone || '').localeCompare(b.volunteer.phone || '');
          break;
        case 'message':
          comparison = a.message.localeCompare(b.message);
          break;
        case 'scheduled':
          comparison = new Date(a.scheduled_for || 0).getTime() - new Date(b.scheduled_for || 0).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [notifications, sortField, sortDirection]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading notifications: {error}</div>;

  const getNotificationStatus = (notification: any) => {
    const now = new Date();
    const scheduledDate = notification.scheduled_for ? new Date(notification.scheduled_for) : null;
    
    if (scheduledDate && now > scheduledDate) {
      return 'delivered';
    }
    return notification.status;
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-light">
            <th>
              <SortableColumn
                label="Volunteer Name"
                field="name"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
            <th>
              <SortableColumn
                label="Phone"
                field="phone"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
            <th>
              <SortableColumn
                label="Message"
                field="message"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
            <th>
              <SortableColumn
                label="Message Delivery"
                field="scheduled"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
            <th className="px-4 py-2 text-left text-dark/70 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark/10">
          {sortedNotifications.map(notification => (
            <tr key={notification.id} className="hover:bg-light/50">
              <td className="px-4 py-2 text-dark">
                {notification.volunteer.first_name} {notification.volunteer.last_name}
              </td>
              <td className="px-4 py-2 text-dark">
                {notification.volunteer.phone}
              </td>
              <td className="px-4 py-2 text-dark text-sm">
                {notification.message}
              </td>
              <td className="px-4 py-2 text-dark">
                {notification.scheduled_for ? formatDateTime(notification.scheduled_for) : '-'}
              </td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 text-sm rounded-full ${getStatusStyles(getNotificationStatus(notification))}`}>
                  {getNotificationStatus(notification)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}