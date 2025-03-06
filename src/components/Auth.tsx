import { useState } from 'react';
import { useAuthStore } from '../store/auth';

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
            return; // Skip the "check email" message
          } catch (signInError: any) {
            console.error('Auto sign-in after signup failed:', signInError);
            // Continue with normal flow if auto-signin fails
          }
        }
        
        // Standard sign-up flow (not purchase flow)
        setError('Please check your email to verify your account');
      } else {
        console.log('Attempting to sign in with email:', email);
        await signIn(email, password);
        console.log('Sign in successful');
        
        // Call the success callback if provided
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      if (error.message === 'Invalid login credentials') {
        setError('Invalid email or password. Please try again.');
      } else if (error.message?.includes('Email not confirmed') && !purchaseFlow) {
        // Only show this error if not in purchase flow
        setError('Please verify your email address before signing in.');
      } else {
        setError(`Authentication failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            required
            minLength={6}
            disabled={isLoading}
          />
          {isSignUp && (
            <p className="mt-1 text-sm text-gray-500">
              Password must be at least 6 characters long
            </p>
          )}
        </div>
        {error && (
          <div className={`text-sm ${error.includes('verify') ? 'text-blue-600' : 'text-red-500'}`}>
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            'Please wait...'
          ) : (
            purchaseFlow && isSignUp ? 'Sign Up & Continue' : (isSignUp ? 'Sign Up' : 'Sign In')
          )}
        </button>
      </form>
      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError('');
          setEmail('');
          setPassword('');
        }}
        className="mt-4 text-primary hover:text-primary/80 text-sm"
        disabled={isLoading}
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
    </div>
  );
};