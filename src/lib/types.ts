export interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: {
    fats: number;
    carbs: number;
    protein: number;
    calories: number;
  };
}

export interface DayPlan {
  day: string;
  meals: Meal[];
}

export interface WeekPlan {
  weekNumber: number;
  days: DayPlan[];
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  price: number;
  content: {
    weeks: WeekPlan[];
  };
  created_at?: string;
  updated_at?: string;
} 