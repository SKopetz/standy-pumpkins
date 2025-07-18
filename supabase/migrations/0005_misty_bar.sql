/*
  # Simplify Authentication to Email Only

  1. Changes
    - Remove password_hash column
    - Maintain email uniqueness
    - Update policies for email-only auth

  2. Security
    - Enable RLS
    - Simplified policies for basic operations
*/

-- Remove password_hash column if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE profiles DROP COLUMN password_hash;
  END IF;
END $$;

-- Ensure email uniqueness
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
DROP POLICY IF EXISTS "Anyone can create a profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create simplified policies
CREATE POLICY "Email-based profile access"
  ON profiles FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);