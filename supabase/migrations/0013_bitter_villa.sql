/*
  # Add MessageSID field to notifications table
  
  1. Changes
    - Add message_sid column to notifications table to store Twilio message identifiers
    - Create index for faster message_sid lookups
    
  2. Purpose
    - Track Twilio message status and enable message status updates
    - Enable message delivery verification
*/

-- Add message_sid column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'message_sid'
  ) THEN
    ALTER TABLE notifications ADD COLUMN message_sid text;
  END IF;
END $$;

-- Create index for message_sid lookups
CREATE INDEX IF NOT EXISTS idx_notifications_message_sid 
  ON notifications(message_sid)
  WHERE message_sid IS NOT NULL;