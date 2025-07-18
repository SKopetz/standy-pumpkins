import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type SubscriptionConfig = {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
};

export function useRealtimeSubscription(
  config: SubscriptionConfig | SubscriptionConfig[],
  onUpdate: () => void
) {
  useEffect(() => {
    const configs = Array.isArray(config) ? config : [config];
    const channels: RealtimeChannel[] = [];

    configs.forEach((cfg) => {
      const channel = supabase
        .channel(`${cfg.table}_changes_${Math.random()}`)
        .on('postgres_changes',
          {
            event: cfg.event || '*',
            schema: 'public',
            table: cfg.table,
            ...(cfg.filter ? { filter: cfg.filter } : {})
          },
          () => onUpdate()
        )
        .subscribe();

      channels.push(channel);
    });

    return () => {
      channels.forEach(channel => channel.unsubscribe());
    };
  }, []);
}