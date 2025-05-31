export interface WorkoutPlan {
  id: string | null;
  title: string;
  description: string;
  price: number;
  content: {
    weeks: WorkoutWeek[];
    rawText?: string;
    appendix?: WorkoutPlanAppendix;
    metadata?: {
      thumbnailUrl?: string;
      [key: string]: any;
    };
  };
  estimated_calories_burned?: number;
  duration_weeks?: number;
  includes_equipment_list?: boolean;
  includes_exercise_descriptions?: boolean;
  fitness_type?: string;
  difficulty_level?: string;
  workout_duration?: string;
  target_muscle_groups?: string;
  thumbnail_url?: string;
  image_url?: string;
  pdf_url?: string;
  is_hidden?: boolean;
}

export interface WorkoutWeek {
  weekNumber: number;
  days: WorkoutDay[];
}

export interface WorkoutDay {
  day: string;
  workouts: Workout[];
}

export interface Workout {
  name: string;
  type: string; // e.g., "Warm-up", "Strength", "Cardio", "Cool-down"
  exercises?: Exercise[];
  duration?: string;
  sets?: number;
  reps?: string;
  rest?: string;
  description?: string;
  instructions?: string[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string; // Can be "12-15", "30 seconds", etc.
  rest: string;
  weight?: string;
  notes?: string;
  targetMuscles?: string[];
}

export interface WorkoutPlanAppendix {
  equipmentList?: string[];
  safetyTips?: string[];
  progressionGuide?: string[];
  nutritionTips?: string[];
  recoveryTips?: string[];
  additionalNotes?: string[];
}

export interface WorkoutPlanPurchase {
  id: string;
  user_id: string;
  workout_plan_id: string;
  payment_id?: string;
  amount: number;
  status: string;
  email: string;
  created_at: string;
  updated_at: string;
} 