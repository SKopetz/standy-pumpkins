import { useState, useCallback, useMemo } from 'react';
import { formatMobileDate } from '../utils/dateUtils';
import type { DayWithEvents } from '../types/calendar.types';

const INITIAL_WEEKS = 2;
const WEEKS_PER_LOAD = 1;

export function useMobileCalendar(calendarDays: DayWithEvents[]) {
  const [visibleWeeks, setVisibleWeeks] = useState(INITIAL_WEEKS);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    setIsLoading(true);
    // Simulate network delay for smooth loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    setVisibleWeeks(prev => prev + WEEKS_PER_LOAD);
    setIsLoading(false);
  }, []);

  const visibleDays = useMemo(() => {
    return calendarDays.slice(0, visibleWeeks * 7);
  }, [calendarDays, visibleWeeks]);

  const dateRange = useMemo(() => {
    if (visibleDays.length === 0) return '';

    const startDate = visibleDays[0].date;
    const endDate = visibleDays[visibleDays.length - 1].date;

    return `${formatMobileDate(startDate)} - ${formatMobileDate(endDate)}`;
  }, [visibleDays]);

  const hasMore = visibleWeeks * 7 < calendarDays.length;

  return {
    visibleDays,
    dateRange,
    loadMore,
    hasMore,
    isLoading
  };
}