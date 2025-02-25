import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { MealPlan } from '../lib/types';

interface MealPlanStore {
  mealPlans: MealPlan[];
  loading: boolean;
  error: string | null;
  fetchMealPlans: () => Promise<void>;
  selectedPlan: MealPlan | null;
  setSelectedPlan: (plan: MealPlan | null) => void;
}

export const useMealPlanStore = create<MealPlanStore>((set) => ({
  mealPlans: [],
  loading: false,
  error: null,
  selectedPlan: null,
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  fetchMealPlans: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ mealPlans: data as MealPlan[], loading: false });
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch meal plans',
        loading: false 
      });
    }
  },
})); 