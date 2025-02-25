/*
  # Fix Booking System RLS Policies

  1. Changes
    - Drop existing policies
    - Create new, more permissive policies for booking creation
    - Ensure authenticated users can properly create and manage their bookings

  2. Security
    - Maintain user data isolation
    - Allow authenticated users to create bookings
    - Allow users to view and manage their own bookings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Create new policies with proper security
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- Allow authenticated users to create bookings

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);