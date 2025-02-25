/*
  # Fix Duplicate Booking Policies

  1. Changes
    - Drop all existing booking policies
    - Recreate policies with proper permissions
    - Ensure no duplicate policies exist

  2. Security
    - Maintain user data isolation
    - Allow authenticated users to create bookings
    - Allow users to view and manage their own bookings
*/

DO $$ 
BEGIN
    -- Drop all existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can delete own bookings" ON bookings;
    
    -- Recreate policies with proper security
    CREATE POLICY "Users can view own bookings_new"
      ON bookings
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can create bookings_new"
      ON bookings
      FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Users can update own bookings_new"
      ON bookings
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete own bookings_new"
      ON bookings
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
END $$;