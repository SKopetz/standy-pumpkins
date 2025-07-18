/*
  # Enable real-time updates for volunteers table

  1. Changes
    - Enable replica identity for volunteers table to support real-time change tracking
    - Create publication for real-time changes
    - Add indexes to improve query performance

  2. Security
    - Maintain existing RLS policies
    - Ensure real-time updates respect RLS
*/

-- Enable replica identity for volunteers table
ALTER TABLE volunteers REPLICA IDENTITY FULL;

-- Create publication for volunteers if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END
$$;

-- Add table to the publication if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'volunteers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE volunteers;
  END IF;
END
$$;

-- Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_volunteers_event_email 
  ON volunteers(event_id, email);

CREATE INDEX IF NOT EXISTS idx_volunteers_group_size 
  ON volunteers(group_size) 
  WHERE group_size > 0;