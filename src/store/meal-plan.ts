import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { MealPlan } from '../types/meal-plan';

interface MealPlanStore {
  mealPlans: MealPlan[];
  loading: boolean;
  error: string | null;
  fetchMealPlans: () => Promise<void>;
  purchaseMealPlan: () => Promise<void>;
}

export const useMealPlanStore = create<MealPlanStore>((set) => ({
  mealPlans: [],
  loading: false,
  error: null,

  fetchMealPlans: async () => {
    set({ loading: true, error: null });
    try {
      const { data: mealPlans, error } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ mealPlans: mealPlans as MealPlan[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  purchaseMealPlan: async () => {
    set({ loading: true, error: null });
    try {
      // Here you would integrate with your payment provider
      // For now, we'll just show a success message
      alert('Payment integration coming soon!');
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));