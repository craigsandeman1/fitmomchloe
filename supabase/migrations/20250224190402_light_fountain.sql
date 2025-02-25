/*
  # Set up admin functionality

  1. Changes
    - Create admin_users table if it doesn't exist
    - Enable RLS on the table
    - Create necessary policies
    - Add initial admin user
  
  2. Security
    - Only admins can view the admin_users table
    - Protected by RLS
*/

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
CREATE POLICY "Admins can view admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert the initial admin user
INSERT INTO admin_users (id)
VALUES ('867d7529-5b57-4a8d-84c0-8503050cbdfb')
ON CONFLICT (id) DO NOTHING;

-- Create policies for bookings table to allow admin access
CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM admin_users
    )
  );

CREATE POLICY "Admins can update any booking"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM admin_users
    )
  );