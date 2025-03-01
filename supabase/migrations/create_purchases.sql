-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can create own purchases" ON purchases;
DROP POLICY IF EXISTS "Admins can view all purchases" ON purchases;
DROP POLICY IF EXISTS "System can update purchases" ON purchases;

-- Create purchases table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  meal_plan_id uuid REFERENCES meal_plans(id) NOT NULL,
  payment_id text,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to do everything with their own records
CREATE POLICY "Users can manage own purchases"
  ON public.purchases
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for admins to manage all purchases
CREATE POLICY "Admins can manage all purchases"
  ON public.purchases
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Create policy for system operations (like webhooks)
CREATE POLICY "System can perform all operations"
  ON public.purchases
  FOR ALL
  USING (true)
  WITH CHECK (true); 