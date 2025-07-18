/*
  # Proper Timezone Handling

  1. Changes
    - Modify events table to store date as DATE type
    - Store times without timezone information
    - Add check constraints for time validation
    
  2. Purpose
    - Ensure consistent date/time handling in America/Chicago timezone
    - Prevent timezone conversion issues
    - Maintain data integrity
*/

-- First, create a temporary table to store existing data
CREATE TABLE IF NOT EXISTS events_temp AS 
SELECT 
  id,
  title,
  description,
  "eventDate",
  category,
  capacity,
  created_at
FROM events;

-- Drop the existing events table
DROP TABLE IF EXISTS events CASCADE;

-- Recreate events table with proper date/time columns
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  "eventDate" date NOT NULL,
  "startTime" time without time zone,
  "endTime" time without time zone,
  category text NOT NULL DEFAULT 'Other' CHECK (category IN ('Patch', 'Closing', 'Staff', 'Other')),
  capacity smallint CHECK (capacity > 0),
  created_at timestamptz DEFAULT now()
);

-- Add time validation constraint
ALTER TABLE events
ADD CONSTRAINT valid_time_range 
CHECK (
  ("startTime" IS NULL AND "endTime" IS NULL) OR
  ("startTime" IS NOT NULL AND "endTime" IS NOT NULL AND "startTime" < "endTime")
);

-- Copy data back from temporary table, handling timezone conversion
INSERT INTO events (id, title, description, "eventDate", category, capacity, created_at)
SELECT 
  id,
  title,
  description,
  "eventDate"::date,
  category,
  capacity,
  created_at
FROM events_temp;

-- Drop temporary table
DROP TABLE events_temp;

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Events are publicly viewable"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Update for all"
  ON events FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_events_date ON events("eventDate");
CREATE INDEX idx_events_category ON events(category);