-- First check if profiles table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        RAISE NOTICE 'The profiles table does not exist. Please run the create_profiles_table.sql script first.';
    END IF;
END $$;

-- Create available_time_slots table
CREATE TABLE IF NOT EXISTS available_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER, -- 0-6 for Sunday-Saturday
  specific_date DATE,  -- NULL for recurring weekly slots
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  slot_interval INTEGER DEFAULT 60, -- Duration in minutes (default 60 minutes)
  max_bookings INTEGER DEFAULT 1,   -- Maximum number of bookings allowed per slot
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: Either day_of_week OR specific_date should be set, not both
  CONSTRAINT day_or_date_check CHECK (
    (day_of_week IS NULL AND specific_date IS NOT NULL) OR
    (day_of_week IS NOT NULL AND specific_date IS NULL)
  ),
  
  -- Constraint: day_of_week must be between 0 and 6
  CONSTRAINT valid_day_of_week CHECK (
    day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6)
  ),
  
  -- Constraint: start_time must be before end_time
  CONSTRAINT valid_time_range CHECK (
    start_time < end_time
  )
);

-- Add RLS policies
ALTER TABLE available_time_slots ENABLE ROW LEVEL SECURITY;

-- Use a temporary policy that allows all operations (will be replaced later after profiles table exists)
CREATE POLICY temp_all_access_policy ON available_time_slots
  FOR ALL USING (true);

-- Policy: Anyone can read
CREATE POLICY public_read_policy ON available_time_slots
  FOR SELECT USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_available_time_slots_updated_at
BEFORE UPDATE ON available_time_slots
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default time slots (common hours for all weekdays)
INSERT INTO available_time_slots (day_of_week, start_time, end_time)
VALUES
  -- Monday (1)
  (1, '09:00:00', '10:00:00'),
  (1, '10:00:00', '11:00:00'),
  (1, '11:00:00', '12:00:00'),
  (1, '14:00:00', '15:00:00'),
  (1, '15:00:00', '16:00:00'),
  (1, '16:00:00', '17:00:00'),
  
  -- Tuesday (2)
  (2, '09:00:00', '10:00:00'),
  (2, '10:00:00', '11:00:00'),
  (2, '11:00:00', '12:00:00'),
  (2, '14:00:00', '15:00:00'),
  (2, '15:00:00', '16:00:00'),
  (2, '16:00:00', '17:00:00'),
  
  -- Wednesday (3)
  (3, '09:00:00', '10:00:00'),
  (3, '10:00:00', '11:00:00'),
  (3, '11:00:00', '12:00:00'),
  (3, '14:00:00', '15:00:00'),
  (3, '15:00:00', '16:00:00'),
  (3, '16:00:00', '17:00:00'),
  
  -- Thursday (4)
  (4, '09:00:00', '10:00:00'),
  (4, '10:00:00', '11:00:00'),
  (4, '11:00:00', '12:00:00'),
  (4, '14:00:00', '15:00:00'),
  (4, '15:00:00', '16:00:00'),
  (4, '16:00:00', '17:00:00'),
  
  -- Friday (5)
  (5, '09:00:00', '10:00:00'),
  (5, '10:00:00', '11:00:00'),
  (5, '11:00:00', '12:00:00'),
  (5, '14:00:00', '15:00:00'),
  (5, '15:00:00', '16:00:00'),
  (5, '16:00:00', '17:00:00')
ON CONFLICT DO NOTHING;

-- Note: Once the profiles table exists, you should run this SQL to add the proper admin policy:
-- 
-- DROP POLICY IF EXISTS temp_all_access_policy ON available_time_slots;
-- CREATE POLICY admin_write_policy ON available_time_slots
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM profiles
--       WHERE profiles.id = auth.uid() AND profiles.is_admin = true
--     )
--   ); 