/*
  # Add SMS preferences to profiles table

  1. Changes
    - Add smsPreference column to profiles table
    - Set default value to true
    - Add index for performance
*/

-- Add SMS preference column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'smspreference'
  ) THEN
    ALTER TABLE profiles ADD COLUMN smsPreference boolean DEFAULT true;
  END IF;
END $$;

-- Create index for SMS preference lookups
CREATE INDEX IF NOT EXISTS idx_profiles_sms_preference ON profiles(smsPreference);