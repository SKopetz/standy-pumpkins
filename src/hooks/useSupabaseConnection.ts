import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

export function useSupabaseConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count');
        if (error) throw error;
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setIsConnected(false);
        setError('Unable to connect to database. Please try again later.');
        console.error('Supabase connection error:', err);
      }
    };

    checkConnection();
  }, []);

  return { isConnected, error };
}