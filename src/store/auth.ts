import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, AuthResponse } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resetPasswordCustom: (email: string) => Promise<void>;
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // Disable email confirmation requirement
        data: {
          email_confirm: false
        }
      }
    });
    if (error) throw error;
    
    // User can now sign in immediately without email verification
    console.log('User signup successful:', data.user?.email, 'Ready to use app immediately');
    
    // If user is created successfully, update the auth state immediately
    if (data.user) {
      set({ user: data.user, loading: false });
    }
    
    return { data, error };
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  },
  resetPasswordCustom: async (email: string) => {
    // Custom password reset using your email service
    const { sendEmail } = await import('../lib/emailService');
    const { PasswordResetEmail } = await import('../email-templates/user/passwordResetEmail');
    
    // Generate a temporary reset token (in production, you'd want a more secure implementation)
    const resetToken = btoa(email + Date.now());
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    // Store the reset token temporarily (you'd want to use a more secure storage in production)
    localStorage.setItem(`reset_token_${email}`, resetToken);
    localStorage.setItem(`reset_token_expires_${email}`, (Date.now() + 24 * 60 * 60 * 1000).toString()); // 24 hours
    
    // Send custom password reset email
    await sendEmail({
      to: email,
      subject: 'Reset Your Password - Fit Mom Chloe',
      reactTemplate: PasswordResetEmail({
        firstName: 'Valued Customer',
        resetLink: resetLink
      }),
    });
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