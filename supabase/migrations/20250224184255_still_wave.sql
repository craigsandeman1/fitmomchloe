/*
  # Meal Plans Schema and Sample Data

  1. New Tables
    - `meal_plans`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (decimal)
      - `content` (jsonb) - Stores weekly meal plan details
      - `dietary_type` (text)
      - `difficulty_level` (text)
      - `preparation_time` (text)
      - `duration_weeks` (integer)
      - `total_calories` (integer)
      - `total_protein` (integer)
      - `total_carbs` (integer)
      - `total_fat` (integer)
      - `includes_grocery_list` (boolean)
      - `includes_recipes` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `meal_plans` table
    - Add policy for authenticated users to read meal plans
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Admins can insert meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Admins can update meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Admins can delete meal plans" ON meal_plans;

-- Create meal plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  content jsonb NOT NULL,
  dietary_type text,
  difficulty_level text,
  preparation_time text,
  duration_weeks integer,
  total_calories integer,
  total_protein integer,
  total_carbs integer,
  total_fat integer,
  includes_grocery_list boolean DEFAULT false,
  includes_recipes boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view meal plans"
  ON meal_plans
  FOR SELECT
  TO authenticated
  USING (true);

-- Add admin policies for meal plans
CREATE POLICY "Admins can insert meal plans"
  ON meal_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admins can update meal plans"
  ON meal_plans
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admins can delete meal plans"
  ON meal_plans
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Insert sample meal plans
INSERT INTO meal_plans (
  title, 
  description, 
  price, 
  content,
  dietary_type,
  difficulty_level,
  duration_weeks,
  total_calories,
  total_protein,
  total_carbs,
  total_fat,
  includes_grocery_list,
  includes_recipes
) VALUES
(
  'Weight Loss Meal Plan',
  'A balanced, calorie-controlled meal plan designed to support healthy weight loss while maintaining energy levels.',
  49.99,
  '{
    "weeks": [{
      "weekNumber": 1,
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "type": "breakfast",
              "name": "Greek Yogurt Parfait with Berries",
              "ingredients": ["Greek yogurt", "Mixed berries", "Honey", "Granola"],
              "instructions": ["Layer yogurt", "Add berries", "Drizzle honey", "Top with granola"],
              "nutritionalInfo": {
                "calories": 350,
                "protein": 20,
                "carbs": 45,
                "fats": 12
              }
            },
            {
              "type": "lunch",
              "name": "Grilled Chicken Salad",
              "ingredients": ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Balsamic dressing"],
              "instructions": ["Grill chicken", "Mix greens", "Add tomatoes", "Dress with balsamic"],
              "nutritionalInfo": {
                "calories": 400,
                "protein": 35,
                "carbs": 20,
                "fats": 15
              }
            },
            {
              "type": "dinner",
              "name": "Baked Salmon with Quinoa",
              "ingredients": ["Salmon fillet", "Quinoa", "Asparagus", "Lemon"],
              "instructions": ["Bake salmon", "Cook quinoa", "Steam asparagus", "Serve with lemon"],
              "nutritionalInfo": {
                "calories": 450,
                "protein": 40,
                "carbs": 35,
                "fats": 20
              }
            }
          ]
        }
      ]
    }]
  }',
  'Standard',
  'Beginner',
  4,
  1200,
  95,
  100,
  47,
  true,
  true
),
(
  'Muscle Gain Meal Plan',
  'High-protein meal plan designed to support muscle growth and recovery while maintaining a lean physique.',
  59.99,
  '{
    "weeks": [{
      "weekNumber": 1,
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "type": "breakfast",
              "name": "Protein Oatmeal Bowl",
              "ingredients": ["Oats", "Whey protein", "Banana", "Almond butter"],
              "instructions": ["Cook oats", "Mix in protein", "Add banana", "Top with almond butter"],
              "nutritionalInfo": {
                "calories": 500,
                "protein": 35,
                "carbs": 60,
                "fats": 15
              }
            },
            {
              "type": "lunch",
              "name": "Turkey Rice Bowl",
              "ingredients": ["Ground turkey", "Brown rice", "Mixed vegetables", "Teriyaki sauce"],
              "instructions": ["Cook turkey", "Prepare rice", "Steam vegetables", "Mix with sauce"],
              "nutritionalInfo": {
                "calories": 600,
                "protein": 45,
                "carbs": 65,
                "fats": 20
              }
            },
            {
              "type": "dinner",
              "name": "Steak with Sweet Potato",
              "ingredients": ["Lean steak", "Sweet potato", "Broccoli", "Olive oil"],
              "instructions": ["Grill steak", "Bake sweet potato", "Steam broccoli", "Season to taste"],
              "nutritionalInfo": {
                "calories": 650,
                "protein": 50,
                "carbs": 45,
                "fats": 25
              }
            }
          ]
        }
      ]
    }]
  }',
  'Standard',
  'Intermediate',
  4,
  1800,
  150,
  120,
  60,
  true,
  true
),
(
  'Plant-Based Meal Plan',
  'Nutrient-rich vegan meal plan designed to provide all essential nutrients while supporting an active lifestyle.',
  54.99,
  '{
    "weeks": [{
      "weekNumber": 1,
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "type": "breakfast",
              "name": "Tofu Scramble",
              "ingredients": ["Tofu", "Spinach", "Nutritional yeast", "Whole grain toast"],
              "instructions": ["Crumble tofu", "Sauté with spinach", "Add seasonings", "Serve with toast"],
              "nutritionalInfo": {
                "calories": 400,
                "protein": 25,
                "carbs": 40,
                "fats": 18
              }
            },
            {
              "type": "lunch",
              "name": "Quinoa Buddha Bowl",
              "ingredients": ["Quinoa", "Chickpeas", "Avocado", "Tahini dressing"],
              "instructions": ["Cook quinoa", "Season chickpeas", "Slice avocado", "Drizzle dressing"],
              "nutritionalInfo": {
                "calories": 450,
                "protein": 20,
                "carbs": 55,
                "fats": 22
              }
            },
            {
              "type": "dinner",
              "name": "Lentil Shepherd''s Pie",
              "ingredients": ["Lentils", "Mashed potatoes", "Mixed vegetables", "Herbs"],
              "instructions": ["Cook lentils", "Prepare vegetables", "Layer with potatoes", "Bake until golden"],
              "nutritionalInfo": {
                "calories": 500,
                "protein": 22,
                "carbs": 70,
                "fats": 15
              }
            }
          ]
        }
      ]
    }]
  }',
  'Vegan',
  'Beginner',
  4,
  1200,
  80,
  100,
  30,
  true,
  true
);