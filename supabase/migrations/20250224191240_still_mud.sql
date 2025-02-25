/*
  # Add new admin user

  1. Changes
    - Add new admin user with ID cb070a08-3a32-4100-a1b9-14f77c7ff3f9
*/

-- Insert the new admin user
INSERT INTO admin_users (id)
VALUES ('cb070a08-3a32-4100-a1b9-14f77c7ff3f9')
ON CONFLICT (id) DO NOTHING;