import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, Mail } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);
  const [resetMethod, setResetMethod] = useState<'supabase' | 'custom' | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get all URL parameters for debugging
    const allParams = Object.fromEntries(searchParams.entries());
    console.log('=== RESET PASSWORD DEBUG ===');
    console.log('Full URL:', window.location.href);
    console.log('All URL parameters:', allParams);
    
    // Check if we have valid reset parameters
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const customToken = searchParams.get('token');
    const email = searchParams.get('email');
    const type = searchParams.get('type');

    const debugData = {
      url: window.location.href,
      allParams,
      accessToken: accessToken ? 'present' : 'missing',
      refreshToken: refreshToken ? 'present' : 'missing',
      customToken: customToken ? 'present' : 'missing',
      email: email || 'missing',
      type: type || 'missing',
      customTokenInfo: customToken && email ? (() => {
        try {
          const decodedToken = atob(customToken);
          const tokenTimestamp = decodedToken.replace(email, '');
          const tokenTime = parseInt(tokenTimestamp);
          const tokenAge = Date.now() - tokenTime;
          return {
            decoded: decodedToken,
            timestamp: tokenTimestamp,
            ageInHours: Math.round(tokenAge / (60 * 60 * 1000) * 10) / 10,
            isExpired: tokenAge > 24 * 60 * 60 * 1000
          };
        } catch (e) {
          return { error: 'Failed to decode token' };
        }
      })() : null,
      timestamp: new Date().toISOString()
    };

    console.log('Debug data:', debugData);
    setDebugInfo(debugData);

    if (accessToken && refreshToken) {
      // Supabase password reset
      setIsValidLink(true);
      setResetMethod('supabase');
      console.log('Using Supabase password reset flow');
    } else if (customToken && email) {
      // Custom password reset - decode token to verify validity and automatically send Supabase reset
      try {
        // The custom token is base64 encoded: email + timestamp
        const decodedToken = atob(customToken);
        console.log('Decoded custom token:', decodedToken);
        
        // Extract timestamp from the token (format: email + timestamp)
        const tokenTimestamp = decodedToken.replace(email, '');
        const tokenTime = parseInt(tokenTimestamp);
        const currentTime = Date.now();
        const tokenAge = currentTime - tokenTime;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        console.log('Custom token validation (new approach):', {
          customToken,
          decodedToken,
          email,
          tokenTimestamp,
          tokenTime,
          currentTime,
          tokenAge,
          maxAge,
          isExpired: tokenAge > maxAge,
          ageInHours: tokenAge / (60 * 60 * 1000)
        });
        
        if (tokenAge <= maxAge) {
          // Valid token - send secure Supabase reset link
          setResetMethod('custom');
          setUserEmail(email);
          console.log('Valid custom token found for email:', email, '- sending secure reset link');
          
          // Send them a secure Supabase reset email for the actual password change
          setIsLoading(true);
          supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
          }).then(({ error }) => {
            if (error) {
              console.error('Error sending secure reset link:', error);
              setError('Unable to send secure reset link. Please try again or contact support.');
            } else {
              setShowEmailSent(true);
            }
            setIsLoading(false);
          });
        } else {
          setError(`Invalid or expired password reset link. Please request a new password reset. (Token expired: ${Math.round(tokenAge / (60 * 60 * 1000))} hours old)`);
          console.log('Custom token expired');
        }
      } catch (tokenError) {
        console.error('Error decoding custom token:', tokenError);
        setError('Invalid password reset link format. Please request a new password reset.');
      }
    } else {
      const missing = [];
      if (!accessToken && !refreshToken && !customToken) missing.push('reset tokens');
      if (!email && !accessToken) missing.push('email');
      
      setError(`Invalid or expired password reset link. Please request a new password reset. (Missing: ${missing.join(', ')})`);
      console.log('No valid reset parameters found');
    }
  }, [searchParams]);

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

    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Only handle Supabase password reset flow here
      // Custom tokens trigger a Supabase reset email automatically
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      
      // Redirect to meal plans after success
      setTimeout(() => {
        navigate('/meal-plans');
      }, 3000);

    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state for custom token processing
  if (resetMethod === 'custom' && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Processing your reset request...</h2>
        </div>
      </div>
    );
  }

  // Show email sent confirmation for custom reset
  if (showEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Almost There!</h1>
          <p className="text-gray-600 mb-6">
            Your request has been verified! For security, we've sent a <strong>secure password reset link</strong> to <strong>{userEmail}</strong>. 
            Please check your inbox and click the new link to set your password.
          </p>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded mb-6">
            <p className="text-sm text-blue-800">
              <strong>Why two emails?</strong> The first email (which you just clicked) verified your identity. 
              This second email contains a secure, encrypted link that lets you safely update your password.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/meal-plans')}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
            >
              Go to Meal Plans
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Didn't receive the secure email? Check your spam folder or try requesting a new reset.
          </p>
        </div>
      </div>
    );
  }

  if (!isValidLink && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Validating reset link...</h2>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          <p className="text-sm text-gray-500">
            You will be redirected to the meal plans page shortly...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-playfair mb-2">Reset Your Password</h1>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>
        
        {error && (
          <div className="p-3 rounded mb-4 bg-red-100 text-red-800">
            {error}
          </div>
        )}
        
        {/* Debug Info - Show in development or when there's an error */}
        {(debugInfo && (import.meta.env.DEV || error)) && (
          <div className="mb-4 p-3 bg-gray-100 rounded border">
            <details>
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                🔍 Debug Information (Click to expand)
              </summary>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Current URL:</strong> {debugInfo.url}</p>
                <p><strong>Parameters found:</strong></p>
                <pre className="bg-white p-2 rounded border text-xs overflow-auto">
                  {JSON.stringify(debugInfo.allParams, null, 2)}
                </pre>
                <div className="mt-2">
                  <p><strong>Expected parameters:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li><strong>Supabase reset:</strong> access_token + refresh_token</li>
                    <li><strong>Custom reset:</strong> token + email</li>
                  </ul>
                </div>
                {Object.keys(debugInfo.allParams).length === 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800"><strong>⚠️ No URL parameters detected</strong></p>
                    <p className="text-yellow-700 text-xs mt-1">
                      This usually means you accessed this page directly instead of clicking a reset link.
                    </p>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
        
        {isValidLink ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter your new password (min. 6 characters)"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Confirm your new password"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate('/meal-plans')}
              className="py-3 px-6 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
            >
              Go to Meal Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 