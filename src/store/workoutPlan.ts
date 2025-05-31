import { create } from 'zustand';
import { supabase, serviceClient } from '../lib/supabase';
import type { WorkoutPlan } from '../types/workout-plan';

interface WorkoutPlanStore {
  workoutPlans: WorkoutPlan[];
  loading: boolean;
  error: string | null;
  fetchWorkoutPlans: () => Promise<void>;
  selectedPlan: WorkoutPlan | null;
  setSelectedPlan: (plan: WorkoutPlan | null) => void;
  importSampleWorkoutPlan: () => Promise<void>;
}

// Sample workout plan data
const sampleWorkoutPlan: WorkoutPlan = {
  id: "sample-workout-plan",
  title: "4-Week Full Body Transformation",
  description: "A comprehensive workout plan designed to build strength, burn fat, and improve overall fitness in just 4 weeks.",
  price: 149.00,
  content: {
    weeks: [{
      weekNumber: 1,
      days: [{
        day: "Monday - Upper Body",
        workouts: [{
          name: "Push-Up Progression",
          type: "strength",
          exercises: [{
            name: "Standard Push-Ups",
            sets: 3,
            reps: "8-12",
            rest: "60 seconds",
            targetMuscles: ["Chest", "Shoulders", "Triceps"]
          }],
          duration: "45 minutes"
        }]
      }]
    }]
  },
  fitness_type: "Full Body",
  difficulty_level: "Intermediate",
  workout_duration: "45-60 minutes",
  duration_weeks: 4,
  estimated_calories_burned: 300,
  includes_equipment_list: true,
  includes_exercise_descriptions: true,
  target_muscle_groups: "Full Body"
};

export const useWorkoutPlanStore = create<WorkoutPlanStore>((set, get) => ({
  workoutPlans: [],
  loading: false,
  error: null,
  selectedPlan: null,
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),

  fetchWorkoutPlans: async () => {
    set({ loading: true, error: null });
    try {
      const { data: workoutPlans, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ workoutPlans: workoutPlans as WorkoutPlan[] });
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  importSampleWorkoutPlan: async () => {
    set({ loading: true, error: null });
    try {
      // Check if sample workout plan already exists
      const { data: existingPlans, error: checkError } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('title', sampleWorkoutPlan.title);

      if (checkError) throw checkError;

      if (existingPlans && existingPlans.length > 0) {
        console.log('Sample workout plan already exists');
        await get().fetchWorkoutPlans();
        return;
      }

      // Insert the sample workout plan
      const { error } = await serviceClient
        .from('workout_plans')
        .insert([{
          title: sampleWorkoutPlan.title,
          description: sampleWorkoutPlan.description,
          price: sampleWorkoutPlan.price,
          content: sampleWorkoutPlan.content,
          fitness_type: sampleWorkoutPlan.fitness_type,
          difficulty_level: sampleWorkoutPlan.difficulty_level,
          workout_duration: sampleWorkoutPlan.workout_duration,
          duration_weeks: sampleWorkoutPlan.duration_weeks,
          estimated_calories_burned: sampleWorkoutPlan.estimated_calories_burned,
          includes_equipment_list: sampleWorkoutPlan.includes_equipment_list,
          includes_exercise_descriptions: sampleWorkoutPlan.includes_exercise_descriptions,
          target_muscle_groups: sampleWorkoutPlan.target_muscle_groups,
          is_active: true
        }]);

      if (error) throw error;

      console.log('Sample workout plan imported successfully');
      await get().fetchWorkoutPlans();
    } catch (error) {
      console.error('Error importing sample workout plan:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
})); 