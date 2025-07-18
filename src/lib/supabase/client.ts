import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

// Create Supabase client with retries
const createClientWithRetry = () => {
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    },
    global: {
      fetch: async (url, options) => {
        const MAX_RETRIES = 3;
        let attempt = 0;
        
        while (attempt < MAX_RETRIES) {
          try {
            const response = await fetch(url, options);
            if (response.ok) return response;
            
            // If response is not ok, wait before retrying
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            attempt++;
          } catch (error) {
            if (attempt === MAX_RETRIES - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            attempt++;
          }
        }
        throw new Error('Failed to connect to Supabase after multiple retries');
      }
    }
  });

  return client;
};

export const supabase = createClientWithRetry();