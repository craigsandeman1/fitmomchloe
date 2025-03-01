export interface MealPlan {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at?: string;
  updated_at?: string;
  pdf_url?: string;
  thumbnail_url?: string;
  content?: {
    weeks: Array<{
      weekNumber: number;
      days: Array<{
        day: string;
        meals: Array<{
          type: string;
          name: string;
          ingredients: string[];
          instructions: string[];
          nutritionalInfo: {
            calories: number;
            protein: number;
            carbs: number;
            fats: number;
          };
        }>;
      }>;
    }>;
  };
}

export interface Purchase {
  id: string;
  user_id: string;
  meal_plan_id: string;
  payment_id?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  email: string;
  created_at: string;
  updated_at: string;
  meal_plans?: MealPlan;
} 