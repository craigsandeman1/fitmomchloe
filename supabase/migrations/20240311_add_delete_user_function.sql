-- Create a function to delete users
-- This function should only be callable by authenticated users with admin privileges
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  calling_user_id uuid;
  is_admin boolean;
BEGIN
  -- Get the ID of the user making the request
  calling_user_id := auth.uid();
  
  -- Check if the calling user is an admin
  SELECT p.is_admin INTO is_admin
  FROM public.profiles p
  WHERE p.id = calling_user_id;
  
  -- Only admins can delete users
  IF is_admin IS NOT TRUE THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;
  
  -- Cannot delete yourself
  IF calling_user_id = user_id THEN
    RAISE EXCEPTION 'Administrators cannot delete their own accounts';
  END IF;
  
  -- Delete from auth.users (this will cascade to profiles due to RLS)
  -- This requires the 'supabase_auth_admin' role
  DELETE FROM auth.users
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$;

-- Set appropriate permissions
GRANT EXECUTE ON FUNCTION delete_user(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION delete_user(uuid) FROM anon, service_role;

-- Update RLS policies on profiles table to ensure cascading delete works
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Ensure the correct role for the function
ALTER FUNCTION delete_user(uuid) OWNER TO supabase_auth_admin; 