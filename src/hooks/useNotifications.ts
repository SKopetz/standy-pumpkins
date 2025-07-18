import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from './useRealtimeSubscription';

interface NotificationWithVolunteer {
  id: string;
  message: string;
  status: string;
  scheduled_for: string | null;
  volunteer: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationWithVolunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          message,
          status,
          scheduled_for,
          volunteer:volunteers (
            first_name,
            last_name,
            phone
          )
        `)
        .gte('scheduled_for', thirtyDaysAgo.toISOString())
        .order('scheduled_for', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useRealtimeSubscription([
    { table: 'notifications' },
    { table: 'volunteers' }
  ], fetchNotifications);

  return { notifications, isLoading, error };
}