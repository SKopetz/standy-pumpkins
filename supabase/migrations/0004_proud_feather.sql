/*
  # Simple Authentication System

  1. Changes
    - Add password_hash column to profiles table
    - Add unique constraint on email
    - Update RLS policies for simpler auth

  2. Security
    - Enable RLS
    - Add policies for basic CRUD operations
    - Index on email field for faster lookups
*/

-- Add password_hash column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE profiles ADD COLUMN password_hash text;
  END IF;
END $$;

-- Add unique constraint on email if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_email_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "Anyone can create a profile"
  ON profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO public
  USING (email = current_user);

-- Create index for email lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);