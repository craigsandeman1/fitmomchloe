import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  checkAdmin: () => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,

  // Sign out the user
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ error: 'Failed to sign out' });
    }
  },

  // Check if the current user is an admin
  checkAdmin: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      // Get the user's role from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return !!data?.is_admin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
}));
