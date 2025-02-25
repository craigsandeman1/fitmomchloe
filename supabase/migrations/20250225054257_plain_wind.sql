/*
  # Set up admin user and permissions

  1. Changes
    - Create admin_users table if it doesn't exist
    - Add policies for admin access
    - Insert initial admin user
*/

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
CREATE POLICY "Anyone can view admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert the admin user
INSERT INTO admin_users (id)
VALUES ('cb070a08-3a32-4100-a1b9-14f77c7ff3f9')
ON CONFLICT (id) DO NOTHING;