import { create } from 'zustand';
import { supabase, serviceClient } from '../lib/supabase';
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
      console.log('Fetching meal plans from database');
      
      // First try with regular client
      const { data: regularData, error: regularError } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (regularError) {
        console.error('Error fetching with regular client:', regularError);
      } else {
        console.log('Regular client results:', regularData);
        console.log('Regular client count:', regularData?.length || 0);
      }
      
      // Then try with service client (which may bypass RLS)
      const { data, error } = await serviceClient
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching meal plans with service client:', error);
        throw error;
      }

      console.log('Service client results:', data);
      console.log('Service client count:', data?.length || 0);
      
      if (data) {
        // Log each meal plan's content and thumbnail info for debugging
        data.forEach((plan: any) => {
          console.log(`Meal plan ${plan.id} (${plan.title}):`);
          if (plan.thumbnail_url) {
            console.log('  Has thumbnail_url:', plan.thumbnail_url);
          }
          if (plan.content) {
            console.log('  Content structure:', Object.keys(plan.content));
            if (plan.content.metadata) {
              console.log('  Metadata:', plan.content.metadata);
            }
            if (plan.content.image) {
              console.log('  Has content.image:', plan.content.image);
            }
          }
        });
      }
      
      // Simply set the data from the database
      set({ mealPlans: data || [], loading: false });
      
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch meal plans',
        loading: false,
        mealPlans: [] // Empty array on error
      });
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