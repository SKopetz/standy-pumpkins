/*
  # Fix Database Relationships and Policies

  1. Changes
    - Add INSERT policy for events table
    - Fix foreign key relationship between volunteers and events
    - Update notifications table schema
    - Add proper indexes and constraints

  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Add INSERT policy for events
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Insert for all" ON events;
  
  CREATE POLICY "Insert for all"
    ON events FOR INSERT
    TO public
    WITH CHECK (true);
END $$;

-- Ensure proper relationship between volunteers and events
DO $$ 
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE volunteers 
    DROP CONSTRAINT IF EXISTS volunteers_event_id_fkey;

  -- Add the constraint back with proper reference
  ALTER TABLE volunteers
    ADD CONSTRAINT volunteers_event_id_fkey 
    FOREIGN KEY (event_id) 
    REFERENCES events(id) 
    ON DELETE CASCADE;
END $$;

-- Update notifications table
DO $$ 
BEGIN
  -- Drop existing table if it exists
  DROP TABLE IF EXISTS notifications;

  -- Create notifications table with proper schema
  CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id uuid REFERENCES volunteers(id) ON DELETE CASCADE,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'pending' 
      CHECK (status IN ('pending', 'scheduled', 'sent', 'cancelled', 'failed')),
    sent_at timestamptz,
    message_sid text,
    error_message text,
    scheduled_for timestamptz,
    updated_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

  -- Create policies
  CREATE POLICY "Admins can manage notifications"
    ON notifications FOR ALL
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    ))
    WITH CHECK (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    ));

  -- Create indexes
  CREATE INDEX idx_notifications_volunteer ON notifications(volunteer_id);
  CREATE INDEX idx_notifications_status ON notifications(status);
  CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
  CREATE INDEX idx_notifications_message_sid 
    ON notifications(message_sid) 
    WHERE message_sid IS NOT NULL;
  CREATE INDEX idx_notifications_updated_at ON notifications(updated_at);
END $$;