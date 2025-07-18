/*
  # Add Event Delete Permissions

  1. Changes
    - Add DELETE policy for events table
    - Update existing policies to be more specific
    - Ensure proper RLS enforcement

  2. Security
    - Only allow deletion if no volunteers are registered
    - Maintain existing RLS
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Events are publicly viewable" ON events;
DROP POLICY IF EXISTS "Insert for all" ON events;
DROP POLICY IF EXISTS "Update for all" ON events;

-- Create more specific policies
CREATE POLICY "Events are publicly viewable"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create events"
  ON events FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update events"
  ON events FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Delete events with no volunteers"
  ON events FOR DELETE
  TO public
  USING (
    NOT EXISTS (
      SELECT 1 FROM volunteers 
      WHERE volunteers.event_id = events.id
    )
  );