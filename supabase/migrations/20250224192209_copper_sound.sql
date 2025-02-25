/*
  # Video Content Management System

  1. New Tables
    - `videos`
      - Basic video information
      - Pricing and access control
    - `video_purchases`
      - Track individual video purchases
    - `video_subscriptions`
      - Manage subscription access
    - `video_categories`
      - Organize videos by type/focus

  2. Security
    - Enable RLS on all tables
    - Add policies for access control
*/

-- Create video categories table
CREATE TABLE video_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text,
  video_url text NOT NULL,
  duration interval,
  difficulty_level text,
  category_id uuid REFERENCES video_categories(id),
  individual_price decimal(10,2),
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create video subscriptions table
CREATE TABLE video_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  plan_type text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_plan_type CHECK (plan_type IN ('monthly', 'yearly', 'premium'))
);

-- Create video purchases table
CREATE TABLE video_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  video_id uuid REFERENCES videos(id) NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  amount_paid decimal(10,2) NOT NULL,
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_purchases ENABLE ROW LEVEL SECURITY;

-- Policies for video_categories
CREATE POLICY "Anyone can view video categories"
  ON video_categories FOR SELECT
  TO authenticated
  USING (true);

-- Policies for videos
CREATE POLICY "Anyone can view video metadata"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

-- Policies for video_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON video_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for video_purchases
CREATE POLICY "Users can view own purchases"
  ON video_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO video_categories (name, description) VALUES
  ('Full Body', 'Complete body workout sessions'),
  ('Core & Abs', 'Focus on core strength and stability'),
  ('Lower Body', 'Legs and glutes focused workouts'),
  ('Upper Body', 'Arms, chest, and back workouts'),
  ('Cardio', 'High-intensity cardio sessions'),
  ('Recovery', 'Stretching and recovery routines'),
  ('Prenatal', 'Safe exercises during pregnancy'),
  ('Postnatal', 'Post-pregnancy recovery workouts');

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_video_categories_updated_at
  BEFORE UPDATE ON video_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_subscriptions_updated_at
  BEFORE UPDATE ON video_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();