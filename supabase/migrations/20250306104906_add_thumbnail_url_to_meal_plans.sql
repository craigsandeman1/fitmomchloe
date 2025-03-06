-- Add thumbnail_url column to meal_plans table
ALTER TABLE IF EXISTS public.meal_plans 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add comment for the column
COMMENT ON COLUMN public.meal_plans.thumbnail_url IS 'URL to the thumbnail image for the meal plan';
