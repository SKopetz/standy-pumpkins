import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CategoryFilter } from '../calendar/CategoryFilter';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { formatEventDate, formatTime, formatDate } from '../../utils/dateUtils';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';

type SortField = 'event' | 'date' | 'slots';
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

interface Event {
  id: string;
  title: string;
  category: string;
  eventDate: string;
  startTime: string | null;
  capacity: number;
  volunteers: { group_size: number }[];
}

export function UpcomingOpenShiftsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(['Patch']));
  const [showNextSevenDays, setShowNextSevenDays] = useState(true);

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

  const fetchEvents = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          category,
          eventDate,
          startTime,
          capacity,
          volunteers (group_size)
        `)
        .gte('eventDate', today.toISOString())
        .order('eventDate', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(
        err instanceof Error 
          ? `Error loading events: ${err.message}` 
          : 'Failed to load events'
      );
    } finally {
      setLoading(false);
    }
  };

  useRealtimeSubscription([
    { table: 'events' },
    { table: 'volunteers' }
  ], fetchEvents);

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEvents = useMemo(() => {
    if (!events) return [];

    const filteredEvents = events.filter(event => {
      // Only show events with available slots
      const filledSlots = event.volunteers?.reduce((sum, v) => sum + v.group_size, 0) || 0;
      const hasOpenSlots = !event.capacity || filledSlots < event.capacity;
      if (!hasOpenSlots) return false;

      // Category filter
      const matchesCategory = selectedCategories.size === 0 || 
        selectedCategories.has(event.category);
      
      // Date filter
      let matchesDate = true;
      if (showNextSevenDays) {
        const eventDate = new Date(event.eventDate);
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        matchesDate = eventDate <= sevenDaysFromNow && eventDate >= new Date();
      }
      
      return matchesCategory && matchesDate;
    });

    return [...filteredEvents].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'event':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          const aDate = new Date(a.eventDate + 'T' + (a.startTime || '00:00:00'));
          const bDate = new Date(b.eventDate + 'T' + (b.startTime || '00:00:00'));
          comparison = aDate.getTime() - bDate.getTime();
          break;
        case 'slots': {
          const aFilled = a.volunteers?.reduce((sum, v) => sum + v.group_size, 0) || 0;
          const bFilled = b.volunteers?.reduce((sum, v) => sum + v.group_size, 0) || 0;
          comparison = aFilled - bFilled;
          break;
        }
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [events, sortField, sortDirection, selectedCategories, showNextSevenDays]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

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
                  label="Slots Filled"
                  field="slots"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/10">
            {sortedEvents.map(event => {
              const dateStr = formatDate(event.eventDate);
                            
              let dateHeader = null;
              if (dateStr !== currentDate) {
                currentDate = dateStr;
                dateHeader = (
                  <tr key={`date-${dateStr}`} data-date-header>
                    <td 
                      colSpan={3} 
                      className="bg-gray-200 px-4 py-2 font-medium text-dark"
                    >
                      {dateStr}
                    </td>
                  </tr>
                );
              }

              const filledSlots = event.volunteers?.reduce((sum, v) => sum + v.group_size, 0) || 0;

              return (
                <React.Fragment key={event.id}>
                  {dateHeader}
                  <tr className="hover:bg-light/50">
                    <td className="px-4 py-2 text-dark">
                      {event.title}
                    </td>
                    <td className="px-4 py-2 text-dark whitespace-nowrap">
                      {formatEventDate(event.eventDate)}
                      {event.startTime && (
                        <span className="ml-2 text-dark/70">
                          {formatTime(event.startTime)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-dark">
                      {filledSlots}/{event.capacity || '∞'}
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