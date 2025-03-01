-- This SQL script fixes admin status inconsistencies
-- Run this in the Supabase SQL Editor

-- Replace 'your-email@example.com' with the admin user's email
-- This makes sure the user has is_admin=true in the profiles table
UPDATE profiles 
SET is_admin = true 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);

-- This makes sure the user is in the admin_users table
INSERT INTO admin_users (id)
SELECT id FROM auth.users WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO NOTHING;

-- Check the result
SELECT 
  au.email,
  p.is_admin,
  CASE WHEN adu.id IS NOT NULL THEN true ELSE false END as in_admin_users
FROM 
  auth.users au
JOIN 
  profiles p ON au.id = p.id
LEFT JOIN 
  admin_users adu ON au.id = adu.id
WHERE 
  au.email = 'your-email@example.com'; 