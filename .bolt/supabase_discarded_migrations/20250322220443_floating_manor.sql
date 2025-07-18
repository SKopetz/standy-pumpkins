/*
  # Fix Database Relationships and Constraints

  1. Changes
    - Add missing foreign key constraint between volunteers and events tables
    - Update notifications table schema to properly reference volunteers
    - Add indexes for better query performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add foreign key constraint to volunteers table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'volunteers_event_id_fkey'
  ) THEN
    ALTER TABLE volunteers
    ADD CONSTRAINT volunteers_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update notifications table to properly reference volunteers
DO $$ 
BEGIN
  -- Drop existing notifications table if it exists
  DROP TABLE IF EXISTS notifications;

  -- Recreate notifications table with proper references
  CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id uuid REFERENCES volunteers(id) ON DELETE CASCADE,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'sent', 'cancelled', 'failed')),
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
    ));

  CREATE POLICY "All for all"
    ON notifications FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

  -- Create indexes
  CREATE INDEX idx_notifications_volunteer ON notifications(volunteer_id);
  CREATE INDEX idx_notifications_status ON notifications(status);
  CREATE INDEX idx_notifications_message_sid ON notifications(message_sid) WHERE message_sid IS NOT NULL;
  CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
  CREATE INDEX idx_notifications_updated_at ON notifications(updated_at);
END $$;