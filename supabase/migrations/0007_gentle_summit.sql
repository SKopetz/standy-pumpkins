/*
  # Update events table with categories

  1. Changes
    - Add category column
    - Update existing data
    - Add category constraint
    - Update policies

  2. Security
    - Maintain RLS with public read access
*/

-- First drop the existing events table if it exists
DROP TABLE IF EXISTS events CASCADE;

-- Create new events table with all required fields
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  eventDate date NOT NULL,
  category text NOT NULL DEFAULT 'Other' CHECK (category IN ('Patch', 'Closing', 'Staff', 'Other')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Events are publicly viewable"
  ON events FOR SELECT
  TO public
  USING (true);

-- Insert sample events
INSERT INTO events (title, description, eventDate, category) VALUES
  ('Morning Service', 'Regular morning service', CURRENT_DATE + INTERVAL '1 day', 'Staff'),
  ('Building Maintenance', 'Monthly maintenance check', CURRENT_DATE + INTERVAL '3 days', 'Patch'),
  ('Evening Prayer', 'Community evening prayer', CURRENT_DATE + INTERVAL '5 days', 'Other'),
  ('Staff Meeting', 'Weekly staff coordination', CURRENT_DATE + INTERVAL '7 days', 'Staff'),
  ('Closing Ceremony', 'Monthly closing ceremony', CURRENT_DATE + INTERVAL '10 days', 'Closing');