import { supabase } from './supabase';

export const debugAuth = {
  // Check current user status
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Current user:', user);
      console.log('User error:', error);
      return { user, error };
    } catch (err) {
      console.error('Error getting current user:', err);
      return { user: null, error: err };
    }
  },

  // Check session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('Session error:', error);
      return { session, error };
    } catch (err) {
      console.error('Error getting session:', err);
      return { session: null, error: err };
    }
  },

  // Test signup with detailed logging
  async testSignup(email: string, password: string) {
    console.log('Testing signup for:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      console.log('Signup result:', {
        user: data.user,
        session: data.session,
        error: error
      });
      
      if (data.user) {
        console.log('User created:', {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: !!data.user.email_confirmed_at,
          emailConfirmedAt: data.user.email_confirmed_at,
          createdAt: data.user.created_at
        });
      }
      
      return { data, error };
    } catch (err) {
      console.error('Signup error:', err);
      return { data: null, error: err };
    }
  },

  // Test signin with detailed logging
  async testSignin(email: string, password: string) {
    console.log('Testing signin for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Signin result:', {
        user: data.user,
        session: data.session,
        error: error
      });
      
      return { data, error };
    } catch (err) {
      console.error('Signin error:', err);
      return { data: null, error: err };
    }
  },

  // Check if email confirmation is required
  async checkEmailConfirmationSettings() {
    // This would require admin access to check auth settings
    // For now, we'll just log what we can determine from user creation
    console.log('Email confirmation settings check - this requires admin access');
    console.log('Check your Supabase dashboard under Authentication > Settings');
    console.log('Look for "Confirm email" setting');
  },

  // Manually confirm user email (development only)
  async manuallyConfirmUser(email: string) {
    console.log('Attempting to manually confirm user:', email);
    try {
      // First try to get the user ID from the current session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email === email) {
        // This approach won't work with regular client, but let's try anyway
        console.log('Found user to confirm:', user.id);
        
        // Unfortunately, we can't manually confirm users from the client side
        // This requires admin/service role access
        console.error('Manual confirmation requires admin access');
        console.log('Solutions:');
        console.log('1. Disable email confirmation in Supabase dashboard');
        console.log('2. Check your email for the confirmation link');
        console.log('3. Use the Supabase CLI: supabase auth update <user-id> --email-confirm');
        
        return { 
          success: false, 
          error: 'Manual confirmation requires admin access. Please disable email confirmation in dashboard or check your email.' 
        };
      } else {
        return { 
          success: false, 
          error: 'No matching user found in current session' 
        };
      }
    } catch (err) {
      console.error('Error in manual confirmation:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  },

  // Test custom confirmation flow
  async testCustomConfirmation(email: string, password: string) {
    console.log('Testing custom confirmation flow...');
    
    try {
      // 1. Test signup
      const signupResult = await this.testSignup(email, password);
      
      if (signupResult.error) {
        return { step: 'signup', ...signupResult };
      }
      
      // 2. Generate confirmation token (simulated)
      const token = crypto.randomUUID() + '-' + Date.now().toString(36);
      console.log('Generated token:', token);
      
      // 3. Store token in localStorage for testing (instead of database)
      const tokenData = {
        userId: signupResult.data?.user?.id,
        email: email,
        token: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        used: false
      };
      
      localStorage.setItem(`confirmation_token_${token}`, JSON.stringify(tokenData));
      console.log('Token stored in localStorage for testing');
      
      // 4. Generate confirmation URL
      const confirmationUrl = `${window.location.origin}/confirm-email?token=${token}`;
      console.log('Confirmation URL:', confirmationUrl);
      
      return {
        step: 'complete',
        success: true,
        token,
        confirmationUrl,
        message: 'Custom confirmation flow test completed. Copy the URL above to test confirmation.'
      };
      
    } catch (error) {
      console.error('Custom confirmation test error:', error);
      return { 
        step: 'error', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Test token validation (for localStorage version)
  async testTokenValidation(token: string) {
    console.log('Testing token validation for:', token);
    
    try {
      const stored = localStorage.getItem(`confirmation_token_${token}`);
      
      if (!stored) {
        throw new Error('Token not found');
      }
      
      const tokenData = JSON.parse(stored);
      
      // Check if expired
      if (new Date() > new Date(tokenData.expiresAt)) {
        throw new Error('Token expired');
      }
      
      // Check if already used
      if (tokenData.used) {
        throw new Error('Token already used');
      }
      
      // Mark as used
      tokenData.used = true;
      tokenData.usedAt = new Date().toISOString();
      localStorage.setItem(`confirmation_token_${token}`, JSON.stringify(tokenData));
      
      console.log('Token validation successful');
      return {
        success: true,
        email: tokenData.email,
        message: 'Token validated successfully (localStorage version)'
      };
      
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
} 