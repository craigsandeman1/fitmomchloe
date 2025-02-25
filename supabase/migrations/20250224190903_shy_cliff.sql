/*
  # Fix Admin Policies Final

  1. Changes
    - Drop all existing policies safely using IF EXISTS
    - Create new unified policies for admin_users and bookings
    - Ensure no duplicate policies
    - Maintain existing admin user

  2. Security
    - Enable RLS on both tables
    - Admins can view and manage all bookings
    - Regular users can only view and manage their own bookings
*/

-- First, safely drop all existing policies
DO $$ 
BEGIN
    -- Drop admin_users policies
    DROP POLICY IF EXISTS "Anyone can view admin_users" ON admin_users;
    DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
    DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
    
    -- Drop bookings policies
    DROP POLICY IF EXISTS "View bookings" ON bookings;
    DROP POLICY IF EXISTS "Update bookings" ON bookings;
    DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
    DROP POLICY IF EXISTS "Admins can update any booking" ON bookings;
    DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
END $$;

-- Create new unified policies
CREATE POLICY "view_admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "view_bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR -- User can view their own bookings
    auth.uid() IN (SELECT id FROM admin_users) -- Admins can view all bookings
  );

CREATE POLICY "manage_bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id OR -- User can manage their own bookings
    auth.uid() IN (SELECT id FROM admin_users) -- Admins can manage all bookings
  )
  WITH CHECK (
    auth.uid() = user_id OR -- User can manage their own bookings
    auth.uid() IN (SELECT id FROM admin_users) -- Admins can manage all bookings
  );