import { createClient, AuthChangeEvent } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Service key is used for admin-like operations
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Create a temporary client with service role if available (for bypassing RLS)
export const serviceClient = supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
  : supabase;

// Initialize auth state
supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    console.log('User signed in or token refreshed');
  }
});

// Utility function to verify Supabase connection
export const verifySupabaseConnection = async () => {
  try {
    // Test connection with a simple query
    const { data, error } = await supabase
      .from('meal_plans')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection error:', error);
      return {
        connected: false,
        error: error.message
      };
    }
    
    return {
      connected: true,
      data
    };
  } catch (err) {
    console.error('Failed to verify Supabase connection:', err);
    return {
      connected: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};

// Diagnostic function to check if a specific meal plan exists
export const checkSpecificMealPlan = async () => {
  try {
    // Try first with regular client
    const { data: regularData, error: regularError } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', '74097299-2315-4b61-9ef4-0e41621b029d')
      .limit(1);
    
    console.log('Regular client check result:', {
      success: !regularError,
      count: regularData?.length || 0,
      error: regularError ? regularError.message : null
    });
    
    // Then try with service client
    const { data, error } = await serviceClient
      .from('meal_plans')
      .select('*')
      .eq('id', '74097299-2315-4b61-9ef4-0e41621b029d')
      .limit(1);
    
    if (error) {
      console.error('Error fetching specific meal plan with service client:', error);
      return {
        exists: false,
        error: error.message
      };
    }
    
    if (!data || data.length === 0) {
      return {
        exists: false,
        error: 'Meal plan not found'
      };
    }
    
    console.log('Found specific meal plan with service client:', data[0]);
    return {
      exists: true,
      data: data[0]
    };
  } catch (err) {
    console.error('Failed to check specific meal plan:', err);
    return {
      exists: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};

// Test RLS policies for meal plans
export const testMealPlanAccess = async () => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('id, title')
      .limit(1);
      
    if (error) {
      console.error('Meal plan access error:', error);
      return {
        access: false,
        error: error.message
      };
    }
    
    return {
      access: true,
      data
    };
  } catch (err) {
    console.error('Failed to test meal plan access:', err);
    return {
      access: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};

// Force insert the example meal plan
export const forceInsertExampleMealPlan = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    console.log('Current user:', userId ? `User ID: ${userId}` : 'Not logged in');
    
    const mealPlan = {
      id: '74097299-2315-4b61-9ef4-0e41621b029d',
      title: '5 Day Veggie Reset Meal Plan',
      description: 'A comprehensive 5-day meal plan focused on vegetable-based meals for a nutritional reset.',
      price: 750.00,
      content: {
        image: "https://qnnmlclobwtgbgxpewri.supabase.co/storage/v1/object/public/Images/meal-plans/1741262553772-00e4373c-9c56-4173-a930-f9d4af71c04c.jpg",
        weeks: [],
        rawText: "VEGGIE RESET MEAL PLAN 5 DAY PLANNER \nThis meal plan is designed for a 16:8 intermittent fasting window. Dairy is completely optional and may be left out of meals as you wish. Start each day with a cup of warm water with a tablespoon of apple cider vinegar, fresh lemon juice and a dash of cayenne pepper and turmeric. For added benefits drink this 15 minutes before each main meal. You may drink tea and coffee (preferably black) during this window. And LOTS of water. In the appendix you will see a list of acceptable snacks and suggested supplements that will help you along your reset journey.\nDAY 1\nLUNCH:\nBaked Sweet Potato with Avo and Cucumber Baked Sweet Potato drizzled in olive oil and crumbled feta (half a ring), served with half an avocado and some cucumber and seasoned with herb salt.\nSNACK ONE (Around 3pm)\nDINNER:\nStreamed Green Veg with Basil Pesto, Avocado and Feta Steam green vegetables (broccoli, brussels sprouts, green beans, zucchini, etc) until cooked but still a bit crunchy. Crumble over feta, chopped cucumber and tomatoes and half an avocado. Drizzle with a tablespoon of basil pesto and season with herb salt. Add cayenne pepper for extra fat burning effect.\nSNACK TWO (Before 8pm)\nDAY 2\nLUNCH:\nSpinach and Feta Open Omelette with Salad For omelette: 2 eggs Big handful of spinach Half a ring of feta Handful of cherry tomato's Wilt spinach in a pan with some olive oil then add whisked eggs and crumbled feta. Place lid over pan and cook until done. Season with herb salt and some fresh chili or cayenne pepper, if you desire. For salad: Mixed salad leaves of choice, half an avocado, cucumber, tomatoes, carrots, sprouts, onion (optional), olive oil, fresh lemon juice, season with herb salt.\nSNACK ONE (Around 3pm)\nDINNER:\nRoast Vegetables with Feta and Avocado Roast low carb vegetables (ie, no potatoes, butternut etc), on a roasting pan with some olive oil and seasoning. Once done crumble over half a ring of feta and half an avocado.\nSNACK TWO (Before 8pm)\nDAY 3\nLUNCH:\nBean and Pesto Salad 1 tin red kidney beans (drained and rinsed), half an avocado, half a ring of feta, handful cherry tomatoes, onion (optional), olive oil, squeeze of lemon, herb salt. Mix in a tablespoon of basil pesto. Toss and serve.\nSNACK ONE (Around 3pm)\nDINNER:\nVegetable Stir Fry 1 pack julienne stir fry mix with added mushrooms and broccoli. Stir fry with some olive oil and soy sauce.\nSNACK TWO (Before 8pm)\nDAY 4\nLUNCH:\nSmashed Creamy Avo and Scrambled Eggs on Seed Crackers Half a smashed avocado with half a ring of feta and herb salt served on top of carb clever seed crackers (max 3) topped with 2 scrambled (or hard boiled) eggs.\nSNACK ONE (Around 3PM)\nDINNER:\nTurmeric Veg and Mushroom Stir Fry Add zucchini, asparagus, green beans, and mixed exotic mushrooms to a pan with some olive oil, onion and garlic and some turmeric and cayenne pepper and stir fry until golden. Once done sprinkle over some grated parmesan and serve with half an avocado.\nSNACK TWO (Before 8pm)\nDAY 5\nLUNCH:\nMushroom and Spinach Scramble with Fresh Garnish For Scramble: 2 eggs, big handful of spinach, mushrooms (as many as you like), scrambled with olive oil and seasoned with herb salt. For Garnish: Half an avocado, some sliced cucumber and cherry tomatoes.\nSNACK ONE (Around 3pm)\nDINNER:\nSpicy Vegetable and Tomato Soup Add mixed low carb vegetables, 1 cup lentils, 1 onion, some garlic, mushrooms and 1 can tinned tomatoes to a pot and add vegetable stock, salt and pepper and lots of chili (as hot as you can handle) and simmer for about an hour or until nice and thick. Serve with some crumbled feta cheese on top.\nSNACK TWO (Before 8pm)\nAPPENDIX\nList of Acceptable Snacks\n• Handful of dried fruit.\n• Handful of mixed nuts.\n• 1 large piece of fruit.\n• Half an avocado with herb salt.\n• Small bowl of popcorn seasoned with herb salt.\n• Small fruit salad with plain Greek yoghurt.\n• Boiled Egg\nSupplements to help with detox:\n• Berberine twice a day 15 minutes before meals.\n• Curcumin one to two times a day with meals.\n• Glutathione 1-2 times per day to help open up detox pathways.\n• L Carnitine before workouts.\n• Probiotics 1-2 times per day.\n• Digestive Enzymes with meals.\nREMEMBER TO DRINK WATER!!!\nHerbal teas such as green tea, dandelion and peppermint tea are also fantastic. Phyto-Cleanse detox tea on the days your tummy is feeling bloated and sluggish. 1 cup at night.",
        metadata: {}
      },
      is_active: true,
      dietary_type: "Vegetarian",
      difficulty_level: "Beginner",
      preparation_time: "30 minutes",
      duration_weeks: 1,
      includes_grocery_list: false,
      includes_recipes: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // If there's a user add a user_id field to help with RLS
      user_id: userId || undefined
    };

    // First, let's see if we can read meal plans to diagnose RLS issues
    const { data: readData, error: readError } = await supabase
      .from('meal_plans')
      .select('count')
      .limit(1);
      
    if (readError) {
      console.error('RLS test - Cannot read meal_plans table:', readError);
    } else {
      console.log('RLS test - Can read meal_plans table, count:', readData);
    }

    // First try to delete if exists to avoid conflicts
    const { error: deleteError } = await serviceClient
      .from('meal_plans')
      .delete()
      .eq('id', mealPlan.id);
      
    if (deleteError) {
      console.error('RLS test - Cannot delete from meal_plans:', deleteError);
    }
    
    // Now try to insert the new meal plan
    const { data, error } = await serviceClient
      .from('meal_plans')
      .insert([mealPlan]);
      
    if (error) {
      console.error('Error inserting example meal plan:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    // Try to read it back to confirm
    const { data: confirmData, error: confirmError } = await serviceClient
      .from('meal_plans')
      .select('*')
      .eq('id', mealPlan.id)
      .limit(1);
      
    if (confirmError) {
      console.error('Error confirming meal plan was inserted:', confirmError);
    } else {
      console.log('Inserted meal plan confirmed:', confirmData);
    }
    
    return {
      success: true,
      data
    };
  } catch (err) {
    console.error('Failed to insert example meal plan:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};
