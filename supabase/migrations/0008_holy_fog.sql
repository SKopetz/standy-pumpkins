/*
  # Add volunteers table and related schemas

  1. New Tables
    - `volunteers`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `group_size` (integer)
      - `event_id` (uuid, references events)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on volunteers table
    - Add policies for public access to allow registration
*/

CREATE TABLE volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  group_size integer NOT NULL CHECK (group_size > 0),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert volunteers"
  ON volunteers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view volunteers count"
  ON volunteers FOR SELECT
  TO public
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_volunteers_event_id ON volunteers(event_id);