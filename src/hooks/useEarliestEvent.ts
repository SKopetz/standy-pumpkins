import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getStartOfWeek } from '../utils/dateUtils';

export function useEarliestEvent() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarliestEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('eventDate')
          .gte('eventDate', new Date().toISOString().split('T')[0])
          .order('eventDate', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        
        // If we have data, use the event date, otherwise use current date
        const dateToUse = data ? new Date(data.eventDate) : new Date();
        const weekStart = getStartOfWeek(dateToUse);
        setStartDate(weekStart);
      } catch (err) {
        console.error('Error fetching earliest event:', err);
        // Fall back to current week if there's an error
        setStartDate(getStartOfWeek(new Date()));
      } finally {
        setLoading(false);
      }
    };

    fetchEarliestEvent();
  }, []);

  return { startDate, loading };
}