import { createClient, AuthChangeEvent } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// We'll add some flags to prevent excessive logging and refresh cycles
let hasLoggedSignIn = false;
let hasLoggedTokenRefresh = false;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Set to false to reduce unnecessary refreshes
  }
});

// Initialize auth state with debouncing to prevent excessive logging
supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
  if (event === 'SIGNED_IN' && !hasLoggedSignIn) {
    console.log('User signed in');
    hasLoggedSignIn = true;
    // Reset after a delay
    setTimeout(() => { hasLoggedSignIn = false; }, 10000);
  } else if (event === 'TOKEN_REFRESHED' && !hasLoggedTokenRefresh) {
    console.log('Token refreshed');
    hasLoggedTokenRefresh = true;
    // Reset after a delay
    setTimeout(() => { hasLoggedTokenRefresh = false; }, 30000);
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