-- Create videos bucket for storing uploaded videos and thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the videos bucket
-- Public read access for videos (anyone can view)
CREATE POLICY "Videos Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Only authenticated users can insert new videos
CREATE POLICY "Authenticated Users can upload videos" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'videos');

-- Only admins can update or delete videos
CREATE POLICY "Only admins can update videos" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'videos' AND 
  (
    SELECT is_admin FROM profiles 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Only admins can delete videos" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'videos' AND 
  (
    SELECT is_admin FROM profiles 
    WHERE id = auth.uid()
  )
);

-- 1. Disable RLS temporarily to break the recursion error and regain access
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 2. Reset the admin system to a clean state

-- Drop ANY policies that mention admin_users to break circular references
DROP POLICY IF EXISTS "admin_update_all_profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view and modify admin_users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can modify admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;

-- 3. Create a simplified working system
-- Add yourself as an admin
UPDATE profiles
SET is_admin = true
WHERE id = 'cb070a08-3a32-4100-a1b9-14f77c7ff3f9';

-- 4. Set up simple, working policies
CREATE POLICY "user_read_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "admin_read_all_profiles" ON profiles
  FOR SELECT USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "user_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_update_any_profile" ON profiles
  FOR UPDATE USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- 5. Re-enable RLS now that we have safe policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; 