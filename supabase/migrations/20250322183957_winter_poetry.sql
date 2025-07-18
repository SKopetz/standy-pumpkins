/*
  # Add notification status tracking columns

  1. Changes
    - Add error_message column for storing error details
    - Add updated_at column for tracking last update
    - Add scheduled_for column for tracking scheduled time
    - Add status constraints

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Add error_message column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE notifications ADD COLUMN error_message text;
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE notifications ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  -- Add scheduled_for column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'scheduled_for'
  ) THEN
    ALTER TABLE notifications ADD COLUMN scheduled_for timestamptz;
  END IF;

  -- Add status constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'notifications' AND column_name = 'status'
  ) THEN
    ALTER TABLE notifications ADD CONSTRAINT notifications_status_check 
      CHECK (status IN ('pending', 'scheduled', 'sent', 'cancelled', 'failed'));
  END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_notifications_updated_at ON notifications(updated_at);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);