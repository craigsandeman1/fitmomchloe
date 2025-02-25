/*
  # Add initial admin user

  1. Changes
    - Insert the specified user ID into admin_users table
  
  2. Security
    - Only adds a single admin user
    - Maintains existing RLS policies
*/

-- Insert the admin user
INSERT INTO admin_users (id)
VALUES ('867d7529-5b57-4a8d-84c0-8503050cbdfb')
ON CONFLICT (id) DO NOTHING;