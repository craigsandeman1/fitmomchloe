-- First check if the bookings table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        -- Create the bookings table if it doesn't exist
        CREATE TABLE bookings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            date TIMESTAMP WITH TIME ZONE NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            email TEXT, -- Make email field nullable
            name TEXT,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Check if email column exists
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'email') THEN
            -- Make the email column nullable (drop the NOT NULL constraint)
            ALTER TABLE bookings ALTER COLUMN email DROP NOT NULL;
        ELSE
            -- Add the email column (nullable)
            ALTER TABLE bookings ADD COLUMN email TEXT;
        END IF;
    END IF;
END $$;

-- Set up RLS policies for the bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own bookings
CREATE POLICY IF NOT EXISTS user_read_own_bookings ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Only admins can read all bookings
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        DROP POLICY IF EXISTS admin_read_all_bookings ON bookings;
        CREATE POLICY admin_read_all_bookings ON bookings
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid() AND profiles.is_admin = true
            )
          );
    END IF;
END $$;

-- Policy: Users can create their own bookings
CREATE POLICY IF NOT EXISTS user_create_own_bookings ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own bookings (but not change user_id)
CREATE POLICY IF NOT EXISTS user_update_own_bookings ON bookings
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Only admins can update any booking
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        DROP POLICY IF EXISTS admin_update_all_bookings ON bookings;
        CREATE POLICY admin_update_all_bookings ON bookings
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid() AND profiles.is_admin = true
            )
          );
    END IF;
END $$;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_booking_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update timestamp
CREATE TRIGGER IF NOT EXISTS update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_booking_updated_at_column(); 