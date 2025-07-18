/*
  # Add userType ENUM to profiles table

  1. Changes
    - Create new ENUM type for user roles
    - Add userType column to profiles table with default value
    - Update existing records to have default user type
    - Add NOT NULL constraint

  2. Security
    - Maintains existing RLS policies
    - Safe migration with no data loss
*/

-- Create ENUM type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
    CREATE TYPE user_type AS ENUM ('user', 'admin');
  END IF;
END $$;

-- Add userType column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'user_type'
  ) THEN
    -- Add column with default value
    ALTER TABLE profiles ADD COLUMN user_type user_type DEFAULT 'user';
    
    -- Update any existing records to have the default user type
    UPDATE profiles SET user_type = 'user' WHERE user_type IS NULL;
    
    -- Make the column NOT NULL after setting defaults
    ALTER TABLE profiles ALTER COLUMN user_type SET NOT NULL;
  END IF;
END $$;

-- Create index for faster user type lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);