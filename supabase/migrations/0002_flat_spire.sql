/*
  # Create volunteer system schema
  
  1. New Tables
    - categories: Stores volunteer activity categories
    - shifts: Stores available volunteer shifts
    - volunteers: Stores volunteer information
    - shift_volunteers: Junction table for shift signups
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
  
  3. Data
    - Insert initial categories
    - Create indexes for performance
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category_id uuid REFERENCES categories(id),
  date timestamptz NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  description text,
  capacity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  created_by text NOT NULL
);

-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create shift_volunteers table
CREATE TABLE IF NOT EXISTS shift_volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid REFERENCES shifts(id) ON DELETE CASCADE,
  volunteer_id uuid REFERENCES volunteers(id) ON DELETE CASCADE,
  signup_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(shift_id, volunteer_id)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_volunteers ENABLE ROW LEVEL SECURITY;

-- Create policies with safety checks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view categories'
    ) THEN
        CREATE POLICY "Anyone can view categories"
        ON categories FOR SELECT
        TO authenticated
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view volunteers'
    ) THEN
        CREATE POLICY "Anyone can view volunteers"
        ON volunteers FOR SELECT
        TO authenticated
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view shift volunteers'
    ) THEN
        CREATE POLICY "Anyone can view shift volunteers"
        ON shift_volunteers FOR SELECT
        TO authenticated
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can sign up for shifts'
    ) THEN
        CREATE POLICY "Authenticated users can sign up for shifts"
        ON shift_volunteers FOR INSERT
        TO authenticated
        WITH CHECK (true);
    END IF;
END
$$;

-- Insert initial categories if they don't exist
INSERT INTO categories (name)
SELECT unnest(ARRAY['Education', 'Service', 'Support', 'Worship'])
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_shifts_category ON shifts(category_id);
CREATE INDEX IF NOT EXISTS idx_shift_volunteers_shift ON shift_volunteers(shift_id);
CREATE INDEX IF NOT EXISTS idx_shift_volunteers_volunteer ON shift_volunteers(volunteer_id);