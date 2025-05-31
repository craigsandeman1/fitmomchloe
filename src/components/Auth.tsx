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
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { signIn, signUp, resetPasswordCustom } = useAuthStore();

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Use our custom email service for password reset
      console.log('Sending password reset email...');
      await resetPasswordCustom(resetEmail);
      setSuccess('Password reset email sent! Please check your inbox and follow the instructions to reset your password.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError('Failed to send password reset email. Please try again or contact support if the problem persists.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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
        // Simple signup flow - no email verification required
        const signupResult = await signUp(email, password);
        
        if (signupResult.data.user) {
          // Success! User is immediately signed up and can use the app
          setSuccess('Account created successfully! You can now access all features.');
          
          // Clear form
          setEmail('');
          setPassword('');
          setIsSignUp(false); // Switch to login view
          
          // Call success callback if provided
          if (onAuthSuccess) {
            setTimeout(() => {
              onAuthSuccess();
            }, 1500);
          }
        }
      } else {
        // Sign in flow
        try {
          await signIn(email, password);
          
          // Clear form and show success
          setEmail('');
          setPassword('');
          setError('');
          setSuccess('Successfully signed in!');
          
          // Call success callback if provided
          if (onAuthSuccess) {
            setTimeout(() => {
              onAuthSuccess();
            }, 1000);
          }
        } catch (signInError: any) {
          // Handle specific auth errors
          if (signInError.message?.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please check your credentials and try again.');
          } else {
            setError(signInError.message || 'Failed to sign in. Please try again.');
          }
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // Handle specific signup errors
      if (err.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
        setIsSignUp(false);
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <h2 className="text-2xl font-playfair text-gray-800 mb-6">Reset Password</h2>
        
        {error && (
          <div className="p-3 rounded mb-4 bg-red-100 text-red-800">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 rounded mb-4 bg-green-100 text-green-800">
            {success}
          </div>
        )}

        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter your email address"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !resetEmail}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowForgotPassword(false);
            setError('');
            setSuccess('');
            setResetEmail('');
          }}
          className="w-full text-gray-600 hover:text-gray-800 underline"
        >
          Back to Sign In
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-playfair text-gray-800 mb-6">
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h2>
      
      {error && (
        <div className="p-3 rounded mb-4 bg-red-100 text-red-800">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 rounded mb-4 bg-green-100 text-green-800">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Enter your email"
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
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
      </button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
            setSuccess('');
          }}
          className="text-primary hover:text-primary/80 underline"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
        
        {!isSignUp && (
          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(true);
              setError('');
              setSuccess('');
            }}
            className="block w-full text-gray-600 hover:text-gray-800 underline"
          >
            Forgot your password?
          </button>
        )}
      </div>

      {isSignUp && (
        <div className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our terms of service and privacy policy.
        </div>
      )}
    </form>
  );
};

export default Auth;
