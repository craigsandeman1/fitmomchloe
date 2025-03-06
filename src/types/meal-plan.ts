export interface MealPlan {
  id: string | null;
  title: string;
  description: string;
  price: number;
  content: {
    weeks: Week[];
    rawText?: string;
    appendix?: MealPlanAppendix;
    metadata?: {
      thumbnailUrl?: string;
      [key: string]: any;
    };
  };
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  duration_weeks?: number;
  includes_grocery_list?: boolean;
  includes_recipes?: boolean;
  dietary_type?: string;
  difficulty_level?: string;
  preparation_time?: string;
  thumbnail_url?: string;
  image_url?: string;
  pdf_url?: string;
  is_hidden?: boolean;
}

interface Week {
  weekNumber: number;
  days: Day[];
}

interface Day {
  day: string;
  meals: Meal[];
}

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };
}

export interface MealPlanAppendix {
  snacks?: string[];
  supplements?: string[];
  breakfasts?: string[];
  reminder?: string;
}