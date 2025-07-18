/*
  # Initial Schema for Volunteer Management System

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text) - Name of the event
      - `description` (text) - Event description
      - `date` (date) - Date of the event
      - `created_at` (timestamp)
      
    - `shifts`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `start_time` (time) - Shift start time
      - `end_time` (time) - Shift end time
      - `volunteers_needed` (int) - Number of volunteers needed
      - `created_at` (timestamp)
      
    - `volunteer_shifts`
      - `id` (uuid, primary key)
      - `shift_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
      
    - `profiles`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `phone` (text)
      - `email` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  start_time time NOT NULL,
  end_time time NOT NULL,
  volunteers_needed integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volunteer_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid REFERENCES shifts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(shift_id, user_id)
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view shifts"
  ON shifts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their volunteer shifts"
  ON volunteer_shifts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can sign up for shifts"
  ON volunteer_shifts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can cancel their shifts"
  ON volunteer_shifts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());