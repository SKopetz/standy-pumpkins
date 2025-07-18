/*
  # Add event times and capacity

  1. Changes
    - Add startTime and endTime columns to events table
    - Add capacity column for volunteer capacity
  
  2. Data Preservation
    - Uses safe column addition
    - No data loss
*/

DO $$ 
BEGIN
  -- Add startTime if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'starttime'
  ) THEN
    ALTER TABLE events ADD COLUMN startTime time;
  END IF;

  -- Add endTime if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'endtime'
  ) THEN
    ALTER TABLE events ADD COLUMN endTime time;
  END IF;

  -- Add capacity if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'capacity'
  ) THEN
    ALTER TABLE events ADD COLUMN capacity integer;
  END IF;
END $$;