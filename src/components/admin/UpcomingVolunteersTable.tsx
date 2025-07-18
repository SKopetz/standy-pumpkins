import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CategoryFilter } from '../calendar/CategoryFilter';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { formatEventDate, formatTime, formatDate } from '../../utils/dateUtils';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';

type SortField = 'event' | 'date' | 'name' | 'size' | 'email' | 'phone';
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

export function UpcomingVolunteersTable() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(['Patch']));
  const [showNextSevenDays, setShowNextSevenDays] = useState(false);

  const categories = ['Patch', 'Closing', 'Staff', 'Other'];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const fetchVolunteers = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select(`
          *,
          event:events (
            id,
            title,
            category,
            eventDate,
            startTime
          )
        `)
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

      if (error) throw error;
      setVolunteers(data || []);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      setError(
        err instanceof Error 
          ? `Error loading volunteers: ${err.message}` 
          : 'Failed to load volunteers'
      );
    } finally {
      setLoading(false);
    }
  };

  useRealtimeSubscription([
    { 
      table: 'volunteers'
    }
  ], fetchVolunteers);

  React.useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedVolunteers = useMemo(() => {
    if (!volunteers) return [];

    const filteredVolunteers = volunteers.filter(volunteer => {
      // Category filter
      const matchesCategory = selectedCategories.size === 0 || 
        selectedCategories.has(volunteer.event.category);
      
      // Date filter
      let matchesDate = true;
      if (showNextSevenDays) {
        const eventDate = new Date(volunteer.event.eventDate);
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        matchesDate = eventDate <= sevenDaysFromNow && eventDate >= new Date();
      }
      
      return matchesCategory && matchesDate;
    });

    return [...filteredVolunteers].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'event':
          comparison = a.event.title.localeCompare(b.event.title);
          break;
        case 'date':
          const aDate = new Date(a.event.eventDate + 'T' + (a.event.startTime || '00:00:00'));
          const bDate = new Date(b.event.eventDate + 'T' + (b.event.startTime || '00:00:00'));
          comparison = aDate.getTime() - bDate.getTime();
          break;
        case 'name':
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
          break;
        case 'size':
          comparison = a.group_size - b.group_size;
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'phone':
          comparison = a.phone.localeCompare(b.phone);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [volunteers, sortField, sortDirection, selectedCategories, showNextSevenDays]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading volunteers: {error}</div>;

  let currentDate: string | null = null;

  return (
    <>
      <div className="overflow-x-auto">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <div className="flex-1">
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onToggle={toggleCategory}
            />
          </div>
          <button
            onClick={() => setShowNextSevenDays(!showNextSevenDays)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ml-4 ${
              showNextSevenDays
                ? 'bg-primary text-dark'
                : 'bg-light-hover text-dark/60 hover:text-dark'
            }`}
          >
            Only show next 7 days
          </button>
        </div>

        <table className="w-full print:w-[100vw]">
        <thead>
          <tr className="bg-light">
            <th className="w-1/5">
              <SortableColumn
                label="Event"
                field="event"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
            <th className="w-1/6">
              <SortableColumn
                label="Date"
                field="date"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
            <th className="w-1/6">
              <SortableColumn
                label="Name"
                field="name"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
            <th className="w-[80px]">
              <SortableColumn
                label="Group Size"
                field="size"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
            <th className="w-1/6">
              <SortableColumn
                label="Email"
                field="email"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
            <th className="w-1/6">
              <SortableColumn
                label="Phone"
                field="phone"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark/10">
          {sortedVolunteers.map(volunteer => {
            const dateStr = formatDate(volunteer.event.eventDate);
            
            let dateHeader = null;
            if (dateStr !== currentDate) {
              currentDate = dateStr;
              dateHeader = (
                <tr key={`date-${dateStr}`} data-date-header>
                  <td 
                    colSpan={6} 
                    className="bg-gray-200 px-4 py-2 font-medium text-dark"
                  >
                    {dateStr}
                  </td>
                </tr>
              );
            }

            return (
              <React.Fragment key={volunteer.id}>
                {dateHeader}
                <tr className="hover:bg-light/50">
                  <td className="px-4 py-2 text-dark">
                    {volunteer.event.title}
                  </td>
                  <td className="px-4 py-2 text-dark whitespace-nowrap">
                    {formatEventDate(volunteer.event.eventDate)}
                    {volunteer.event.startTime && (
                      <span className="ml-2 text-dark/70">
                        {formatTime(volunteer.event.startTime)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-dark">
                    {volunteer.first_name} {volunteer.last_name}
                  </td>
                  <td className="px-4 py-2 text-dark text-left">
                    {volunteer.group_size}
                  </td>
                  <td className="px-4 py-2 text-dark">
                    {volunteer.email}
                  </td>
                  <td className="px-4 py-2 text-dark whitespace-nowrap">
                    {volunteer.phone}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
}