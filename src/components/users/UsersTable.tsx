import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { UserActions } from './UserActions';
import { EditUserModal } from './EditUserModal';
import { DeleteUserDialog } from './DeleteUserDialog';
import type { Profile } from '../../types/profile.types';

type SortField = 'name' | 'email' | 'phone' | 'role' | 'joined';
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

export function UsersTable() {
  const { users, isLoading, error, refetch } = useUsers();
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [deletingUser, setDeletingUser] = useState<Profile | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleEditSuccess = async () => {
    setEditingUser(null);
    await refetch();
  };

  const handleDeleteSuccess = async () => {
    setDeletingUser(null);
    await refetch();
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = useMemo(() => {
    if (!sortField) return users;

    return [...users].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`);
          break;
        case 'email':
          comparison = (a.email || '').localeCompare(b.email || '');
          break;
        case 'phone':
          comparison = (a.phone || '').localeCompare(b.phone || '');
          break;
        case 'role':
          comparison = a.user_type.localeCompare(b.user_type);
          break;
        case 'joined':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [users, sortField, sortDirection]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading users: {error}</div>;

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
                  label="Email"
                  field="email"
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
                  label="Role"
                  field="role"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th>
                <SortableColumn
                  label="Joined"
                  field="joined"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-2 text-left text-dark/70 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/10">
            {sortedUsers.map(user => (
              <tr key={user.id} className="hover:bg-light/50">
                <td className="px-4 py-2 text-dark font-medium">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-2 text-dark">{user.email}</td>
                <td className="px-4 py-2 text-dark">{user.phone || '-'}</td>
                <td className="px-4 py-2 text-dark capitalize">{user.user_type}</td>
                <td className="px-4 py-2 text-dark/70">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <UserActions
                    onEdit={() => setEditingUser(user)}
                    onDelete={() => setDeletingUser(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={handleEditSuccess}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          isOpen={true}
          onClose={handleDeleteSuccess}
        />
      )}
    </>
  );
}