/*
  # Add SMS notification support
  
  1. New Tables
    - notifications
      - id (uuid, primary key)
      - volunteer_id (uuid, references volunteers)
      - message (text)
      - status (text)
      - sent_at (timestamptz)
      
  2. Changes
    - Add notification_preferences to volunteers table
    
  3. Security
    - Enable RLS
    - Add policies for admin access
*/

-- Add notification preferences to volunteers
ALTER TABLE volunteers 
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"sms": true}'::jsonb;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid REFERENCES volunteers(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage notifications"
  ON notifications
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_type = 'admin'
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_volunteer ON notifications(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);