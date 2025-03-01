import { createClient, AuthChangeEvent } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

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