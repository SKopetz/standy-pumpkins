/*
  # Update profile schema with first and last name fields

  1. Changes
    - Add firstName and lastName columns
    - Remove full_name column
    - Update indexes for new columns

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'firstname'
  ) THEN
    ALTER TABLE profiles ADD COLUMN firstName text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'lastname'
  ) THEN
    ALTER TABLE profiles ADD COLUMN lastName text;
  END IF;

  -- Remove full_name column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles DROP COLUMN full_name;
  END IF;
END $$;

-- Create indexes for name fields
CREATE INDEX IF NOT EXISTS idx_profiles_firstname ON profiles(firstName);
CREATE INDEX IF NOT EXISTS idx_profiles_lastname ON profiles(lastName);