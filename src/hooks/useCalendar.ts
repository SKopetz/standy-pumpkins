import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useAuthContext } from '../contexts/AuthContext';
import { useKioskContext } from '../contexts/KioskContext';
import { useEarliestEvent } from './useEarliestEvent';
import type { DayWithEvents, Event } from '../types/calendar.types';
import { getStartOfWeek, getEndOfWeek, addWeeks } from '../utils/dateUtils';

export function useCalendar() {
  const { profile } = useAuthContext();
  const { isKioskMode } = useKioskContext();
  const { startDate: earliestEventDate, loading: loadingStartDate } = useEarliestEvent();
  const isAdmin = profile?.user_type === 'admin';
  
  const [date, setDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(isAdmin ? ['Patch'] : ['Patch'])
  );

  // Initialize date once we have the earliest event date in kiosk mode
  useEffect(() => {
    if (!loadingStartDate) {
      setDate(isKioskMode ? earliestEventDate : getStartOfWeek(new Date()));
    }
  }, [isKioskMode, earliestEventDate, loadingStartDate]);

  const categories = isAdmin ? ['Patch', 'Closing', 'Staff', 'Other'] : [];

  // Number of weeks to display based on kiosk mode
  const weeksToDisplay = isKioskMode ? 7 : 4;

  const getDateRangeHeader = () => {
    if (!date) return '';
    
    const startDate = getStartOfWeek(date);
    const endDate = addWeeks(getEndOfWeek(date), weeksToDisplay);
    
    const startMonth = startDate.toLocaleString('default', { month: 'long' });
    const startYear = startDate.getFullYear();
    const endMonth = endDate.toLocaleString('default', { month: 'long' });
    const endYear = endDate.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonth} ${startYear}`;
    }
    
    if (startYear === endYear) {
      return `${startMonth} - ${endMonth} ${startYear}`;
    }
    
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  };

  const fetchEvents = useCallback(async () => {
    if (!date) return;

    const startDate = getStartOfWeek(date);
    const endDate = addWeeks(getEndOfWeek(date), weeksToDisplay);

    try {
      const query = supabase
        .from('events')
        .select('id, title, description, eventDate, category, startTime, endTime, capacity')
        .gte('eventDate', startDate.toISOString())
        .lte('eventDate', endDate.toISOString());

      if (!isAdmin) {
        query.eq('category', 'Patch');
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [date, isAdmin, weeksToDisplay]);

  useEffect(() => {
    if (date) {
      fetchEvents();
    }
  }, [fetchEvents, date]);

  useRealtimeSubscription([
    { table: 'events' },
    { table: 'volunteers' }
  ], fetchEvents);

  const previousWeek = () => {
    setDate(prev => prev ? addWeeks(prev, -1) : getStartOfWeek(new Date()));
  };

  const nextWeek = () => {
    setDate(prev => prev ? addWeeks(prev, 1) : getStartOfWeek(new Date()));
  };

  const toggleCategory = (category: string) => {
    if (!isAdmin) return;
    
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

  const getCalendarDays = (): DayWithEvents[] => {
    if (!date) return [];

    const days: DayWithEvents[] = [];
    const startDate = getStartOfWeek(date);
    const endDate = addWeeks(getEndOfWeek(date), weeksToDisplay);
    
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      const dayEvents = events
        .filter(event => {
          // Parse the date string directly without timezone conversion
          const [year, month, day] = event.eventDate.split('-').map(Number);
          const eventDate = new Date(year, month - 1, day, 12, 0, 0);
          
          return (
            eventDate.getDate() === currentDate.getDate() &&
            eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear() &&
            (isAdmin ? (selectedCategories.size === 0 || selectedCategories.has(event.category)) : event.category === 'Patch')
          );
        })
        .sort((a, b) => {
          if (a.startTime && b.startTime) {
            return a.startTime.localeCompare(b.startTime);
          }
          if (!a.startTime && !b.startTime) return 0;
          return a.startTime ? -1 : 1;
        });
      
      days.push({
        date: new Date(currentDate),
        events: dayEvents,
        isOutsideMonth: currentDate.getMonth() !== date.getMonth(),
        isToday: 
          currentDate.getDate() === new Date().getDate() &&
          currentDate.getMonth() === new Date().getMonth() &&
          currentDate.getFullYear() === new Date().getFullYear()
      });
      
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    
    return days;
  };

  return {
    dateRangeHeader: getDateRangeHeader(),
    categories,
    selectedCategories,
    toggleCategory,
    previousWeek,
    nextWeek,
    calendarDays: getCalendarDays(),
    isLoading: isLoading || loadingStartDate,
    isAdmin
  };
}