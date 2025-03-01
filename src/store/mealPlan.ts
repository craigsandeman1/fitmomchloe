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
  importSampleMealPlan: () => Promise<void>;
}

// Sample meal plan data provided by user
const sampleMealPlan: MealPlan = {
  id: "16291738-9ad5-491e-8b6e-cbc304d3ce4c",
  title: "Test",
  description: "123",
  price: 123.00,
  content: {
    weeks: [{
      weekNumber: 1,
      days: [{
        day: "Sample Day",
        meals: [{
          name: "Sample Breakfast",
          type: "breakfast",
          ingredients: ["Ingredient 1", "Ingredient 2"],
          instructions: ["Step 1", "Step 2"],
          nutritionalInfo: {
            calories: 400,
            protein: 44,
            carbs: 33,
            fats: 55
          }
        }]
      }]
    }]
  }
};

export const useMealPlanStore = create<MealPlanStore>((set) => ({
  mealPlans: [],
  loading: false,
  error: null,
  selectedPlan: null,
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  fetchMealPlans: async () => {
    try {
      set({ loading: true, error: null });
      console.log('⚠️ Fetching meal plans... Check network tab for request status.');
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error when fetching meal plans:', error);
        throw error;
      }

      console.log('✅ Meal plans fetched successfully:', data);
      
      // If no meal plans from database, use the sample plan for development
      if (!data || data.length === 0) {
        console.log('⚠️ No meal plans found in database, showing fallback sample plan');
        set({ mealPlans: [sampleMealPlan], loading: false });
        return;
      }
      
      set({ mealPlans: data as MealPlan[], loading: false });
    } catch (error) {
      console.error('❌ Error fetching meal plans:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch meal plans',
        loading: false 
      });
      
      // Fallback to sample plan on error
      console.log('⚠️ Falling back to sample plan due to error');
      set({ mealPlans: [sampleMealPlan], loading: false });
    }
  },
  
  importSampleMealPlan: async () => {
    try {
      set({ loading: true, error: null });
      console.log('Importing sample meal plan...');
      
      // Check if the plan already exists
      const { data: existingPlans, error: checkError } = await supabase
        .from('meal_plans')
        .select('id')
        .eq('id', sampleMealPlan.id);
        
      if (checkError) {
        console.error('Error checking for existing plan:', checkError);
        throw checkError;
      }
      
      if (existingPlans && existingPlans.length > 0) {
        console.log('Sample meal plan already exists');
      } else {
        // Insert the sample plan
        const { error: insertError } = await supabase
          .from('meal_plans')
          .insert([sampleMealPlan]);
          
        if (insertError) {
          console.error('Error inserting sample plan:', insertError);
          throw insertError;
        }
        
        console.log('Sample meal plan imported successfully');
      }
      
      // Fetch all meal plans to update the state
      await useMealPlanStore.getState().fetchMealPlans();
    } catch (error) {
      console.error('Error importing sample meal plan:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to import sample meal plan',
        loading: false 
      });
    }
  }
})); 