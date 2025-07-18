import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface EventTemplate {
  title: string;
  description: string | null;
}

export function useEventTemplates() {
  const [templates, setTemplates] = useState<EventTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('title, description')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Remove duplicates while preserving order
        const uniqueTemplates = (data || []).reduce<EventTemplate[]>((acc, current) => {
          // Only add if title is not already in the accumulator
          const titleExists = acc.some(template => template.title === current.title);
          const descriptionExists = acc.some(template => 
            template.description === current.description && current.description !== null
          );

          if (!titleExists || !descriptionExists) {
            acc.push({
              title: titleExists ? '' : current.title, // Only include title if it's unique
              description: descriptionExists ? null : current.description // Only include description if it's unique
            });
          }

          return acc;
        }, []);

        // Filter out empty entries
        setTemplates(uniqueTemplates.filter(template => 
          template.title !== '' || template.description !== null
        ));
      } catch (err) {
        console.error('Error fetching event templates:', err);
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error };
}