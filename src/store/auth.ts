import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, AuthResponse } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    // Update state on successful login
    if (data.user) {
      set({ user: data.user, loading: false });
    }
  },
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    
    // Note: User will need email verification before they can sign in
    // The user object will be returned but email_confirmed_at will be null
    console.log('User signup successful:', data.user?.email, 'Email confirmed:', !!data.user?.email_confirmed_at);
    
    return { data, error };
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state change:', event, 'User:', session?.user?.email);
  if (session?.user) {
    useAuthStore.setState({ user: session.user, loading: false });
  } else {
    useAuthStore.setState({ user: null, loading: false });
  }
});