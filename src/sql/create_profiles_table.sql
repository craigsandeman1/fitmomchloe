-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profiles
CREATE POLICY user_read_own_profile ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Only admins can read all profiles
CREATE POLICY admin_read_all_profiles ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Policy: Users can update their own profiles (except is_admin field)
CREATE POLICY user_update_own_profile ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    coalesce(is_admin, false) = coalesce((SELECT is_admin FROM profiles WHERE id = auth.uid()), false)
  );

-- Policy: Only admins can update admin status
CREATE POLICY admin_update_all_profiles ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_profile_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_updated_at_column();

-- Create function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create a profile for a new user
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Insert existing users into profiles table if they don't already exist
INSERT INTO profiles (id, email, full_name, is_admin)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  false
FROM 
  auth.users
ON CONFLICT (id) DO NOTHING;

-- Set the first user as admin
UPDATE profiles 
SET is_admin = true 
WHERE id IN (
  SELECT id FROM profiles 
  ORDER BY created_at 
  LIMIT 1
);

-- Alternatively, you can specify a specific user to be admin
-- UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com'; 