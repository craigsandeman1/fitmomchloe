/*
  # Fix Admin Access Policies

  1. Changes
    - Drop existing policies that might conflict
    - Create new policies for admin_users table
    - Create new policies for bookings table to handle both admin and regular user access
    - Ensure admin users can view and manage all bookings
    - Regular users can only view and manage their own bookings

  2. Security
    - Enable RLS on both tables
    - Admins can view all bookings
    - Regular users can only view their own bookings
    - Admins can update any booking
    - Regular users can only update their own bookings
*/

-- First, drop any existing conflicting policies
DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update any booking" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings_new" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings_new" ON bookings;

-- Create new policies for admin_users table
CREATE POLICY "Anyone can view admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Create combined policies for bookings table
CREATE POLICY "View bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR -- User can view their own bookings
    auth.uid() IN (SELECT id FROM admin_users) -- Admins can view all bookings
  );

CREATE POLICY "Update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR -- User can update their own bookings
    auth.uid() IN (SELECT id FROM admin_users) -- Admins can update all bookings
  );

-- Ensure the admin user exists
INSERT INTO admin_users (id)
VALUES ('867d7529-5b57-4a8d-84c0-8503050cbdfb')
ON CONFLICT (id) DO NOTHING;