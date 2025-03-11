import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { sendWelcomeEmail } from '../lib/emailUtils';

interface AuthProps {
  onAuthSuccess?: () => void;
  purchaseFlow?: boolean;
}

export const Auth = ({ onAuthSuccess, purchaseFlow = false }: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
        
        // Send custom welcome email via Web3Forms
        try {
          await sendWelcomeEmail(email);
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't block the signup process if email fails
        }
        
        if (purchaseFlow) {
          // For purchase flow: automatically sign them in after sign up
          // Don't make them wait for email verification
          console.log('Signing up in purchase flow, proceeding to sign in automatically');
          try {
            await signIn(email, password);
            
            // If we successfully signed in, call the success callback
            if (onAuthSuccess) {
              onAuthSuccess();
            }
          } catch (signInError) {
            console.error('Error signing in after sign up:', signInError);
            setError('Account created successfully, but there was an issue signing you in automatically. Please try signing in manually.');
          }
        } else {
          // Normal sign up flow
          setError('');
          setIsLoading(false);
          if (!purchaseFlow) {
            setIsSignUp(false); // Switch back to login view
          }
          // Show success message
          setError('Account created successfully! Please check your email to verify your account.');
        }
      } else {
        // Login flow
        await signIn(email, password);
        
        // Clear form
        setEmail('');
        setPassword('');
        setError('');
        
        // Call success callback if provided
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-playfair mb-2">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
        <p className="text-gray-600">
          {isSignUp 
            ? 'Create an account to access your purchases' 
            : 'Sign in to access your account'}
        </p>
      </div>
      
      {error && (
        <div className={`p-3 rounded mb-4 ${error.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder={isSignUp ? 'Create a password (min. 6 characters)' : 'Enter your password'}
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
          className="text-sm text-primary hover:text-primary-dark"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};