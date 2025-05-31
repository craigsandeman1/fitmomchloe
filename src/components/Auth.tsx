import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { sendEmail } from '../lib/emailService';
import { WelcomeEmail } from '../email-templates/user/welcomeEmail';
import { NewUserNotifyEmail } from '../email-templates/admin/newUserNotifyEmail';
import { generateConfirmationToken, storeConfirmationToken, sendConfirmationEmail } from '../lib/confirmationService';

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
        // Sign up flow with custom confirmation
        const signupResult = await signUp(email, password);
        
        if (signupResult.data.user) {
          // Generate and store custom confirmation token
          try {
            const token = generateConfirmationToken();
            await storeConfirmationToken(signupResult.data.user.id, email, token);
            
            // Send custom confirmation email
            await sendConfirmationEmail(email, '', token);
            
            // Send welcome email (optional - can be sent after confirmation)
            try {
              await sendEmail({
                to: email,
                subject: 'Welcome to Fit Mom!',
                reactTemplate: WelcomeEmail({ firstName: '' }),
              });
              await sendEmail({
                to: import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [],
                subject: 'New User registered!',
                reactTemplate: NewUserNotifyEmail({ 
                  firstName: '', 
                  email, 
                  signupDate: new Date().toLocaleString() 
                }),
              });
            } catch (emailError) {
              console.error("Failed to send welcome email:", emailError);
              // Don't block the signup process if welcome email fails
            }
            
            // Show success message
            if (purchaseFlow) {
              setSuccess('Account created! Please check your email and click the confirmation link to continue with your purchase.');
            } else {
              setSuccess('Account created successfully! Please check your email and click the confirmation link to complete your registration.');
            }
            setIsSignUp(false); // Switch to login view
            
          } catch (confirmationError) {
            console.error('Error setting up confirmation:', confirmationError);
            setError('Account created, but there was an issue sending the confirmation email. Please contact support.');
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
            onAuthSuccess();
          }
        } catch (signInError: any) {
          // Handle specific auth errors
          if (signInError.message?.includes('Email not confirmed')) {
            setError('Please check your email and click the confirmation link before signing in. If you didn\'t receive the email, try signing up again.');
          } else if (signInError.message?.includes('Invalid login credentials')) {
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
        <div className="p-3 rounded mb-4 bg-red-100 text-red-800">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 rounded mb-4 bg-green-100 text-green-800">
          {success}
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
            setSuccess('');
          }}
          className="text-sm text-primary hover:text-primary-dark"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};
