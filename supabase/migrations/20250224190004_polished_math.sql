/*
  # Add admin role and policies

  1. New Roles
    - Create admin role for managing bookings
  
  2. Security
    - Add policies for admin access to bookings
    - Enable admin to view and manage all bookings
*/

-- Create admin role
CREATE ROLE admin;

-- Grant admin role to specific users
CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Admins can update any booking"
  ON bookings
  FOR UPDATE
  TO admin
  USING (true);

CREATE POLICY "Admins can delete any booking"
  ON bookings
  FOR DELETE
  TO admin
  USING (true);

-- Add admin_users table to track admin accounts
CREATE TABLE admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view admin_users table
CREATE POLICY "Only admins can view admin_users"
  ON admin_users
  FOR SELECT
  TO admin
  USING (true);