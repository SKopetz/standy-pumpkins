import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useSignups } from '../../hooks/useSignups';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { SignupActions } from './SignupActions';
import { EditSignupModal } from './EditSignupModal';
import { DeleteSignupDialog } from './DeleteSignupDialog';
import { formatEventDate } from '../../utils/dateUtils';
import type { VolunteerWithEvent } from '../../types/volunteer.types';

type SortField = 'name' | 'event' | 'date' | 'email' | 'phone' | 'groupSize';
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

export function SignupsTable() {
  const { signups, isLoading, error, refetch } = useSignups();
  const [editingSignup, setEditingSignup] = useState<VolunteerWithEvent | null>(null);
  const [deletingSignup, setDeletingSignup] = useState<VolunteerWithEvent | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleEditSuccess = async () => {
    setEditingSignup(null);
    await refetch(); // Refresh the data after successful edit
  };

  const handleDeleteSuccess = async () => {
    setDeletingSignup(null);
    await refetch(); // Refresh the data after successful delete
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSignups = useMemo(() => {
    if (!sortField) return signups;

    return [...signups].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`);
          break;
        case 'event':
          comparison = a.event.title.localeCompare(b.event.title);
          break;
        case 'date':
          comparison = new Date(a.event.eventDate).getTime() - new Date(b.event.eventDate).getTime();
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'phone':
          comparison = a.phone.localeCompare(b.phone);
          break;
        case 'groupSize':
          comparison = a.group_size - b.group_size;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [signups, sortField, sortDirection]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading signups: {error}</div>;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-light">
              <th>
                <SortableColumn
                  label="Name"
                  field="name"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th>
                <SortableColumn
                  label="Event"
                  field="event"
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
                  label="Email"
                  field="email"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th>
                <SortableColumn
                  label="Group Size"
                  field="groupSize"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-2 text-left text-dark/70 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/10">
            {sortedSignups.map(signup => (
              <tr key={signup.id} className="hover:bg-light/50">
                <td className="px-4 py-2 text-dark font-medium">
                  {signup.first_name} {signup.last_name}
                </td>
                <td className="px-4 py-2 text-dark">
                  {signup.event.title}
                </td>
                <td className="px-4 py-2 text-dark">
                  {formatEventDate(signup.event.eventDate)}
                </td>
                <td className="px-4 py-2 text-dark">
                  {signup.email}
                </td>
                <td className="px-4 py-2 text-dark text-center">
                  {signup.group_size}
                </td>
                <td className="px-4 py-2">
                  <SignupActions
                    onEdit={() => setEditingSignup(signup)}
                    onDelete={() => setDeletingSignup(signup)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingSignup && (
        <EditSignupModal
          signup={editingSignup}
          onClose={handleEditSuccess}
        />
      )}

      {deletingSignup && (
        <DeleteSignupDialog
          signup={deletingSignup}
          isOpen={true}
          onClose={handleDeleteSuccess}
        />
      )}
    </>
  );
}