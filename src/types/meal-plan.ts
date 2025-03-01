export interface MealPlan {
  id: string | null;
  title: string;
  description: string;
  price: number;
  content: {
    weeks: Week[];
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
  ingredients: string[];
  instructions: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };
}