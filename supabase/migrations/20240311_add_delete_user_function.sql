-- Create a function to soft-delete users by marking them as inactive
CREATE OR REPLACE FUNCTION public.soft_delete_user(user_id uuid)
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
  
  -- Only admins can deactivate users
  IF is_admin IS NOT TRUE THEN
    RAISE EXCEPTION 'Only administrators can deactivate users';
  END IF;
  
  -- Cannot deactivate yourself
  IF calling_user_id = user_id THEN
    RAISE EXCEPTION 'Administrators cannot deactivate their own accounts';
  END IF;
  
  -- Cannot deactivate other admins
  DECLARE
    target_is_admin boolean;
  BEGIN
    SELECT p.is_admin INTO target_is_admin
    FROM public.profiles p
    WHERE p.id = user_id;
    
    IF target_is_admin THEN
      RAISE EXCEPTION 'Cannot deactivate administrator accounts';
    END IF;
  END;
  
  -- Add is_active column if it doesn't exist
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deactivated_at timestamptz;
  EXCEPTION 
    WHEN duplicate_column THEN
      -- Column already exists, do nothing
  END;
  
  -- Mark user as inactive
  UPDATE public.profiles
  SET is_active = false,
      deactivated_at = now()
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$;

-- Set appropriate permissions
GRANT EXECUTE ON FUNCTION public.soft_delete_user(uuid) TO authenticated;

-- Create table column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_active boolean DEFAULT true;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name = 'deactivated_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN deactivated_at timestamptz;
  END IF;
END $$;

-- Update RLS policies on profiles table to ensure cascading delete works
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Ensure the correct role for the function
ALTER FUNCTION public.soft_delete_user(uuid) OWNER TO supabase_auth_admin; 