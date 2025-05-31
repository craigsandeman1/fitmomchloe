import { useState } from 'react';
import { sendEmail } from '../lib/emailService';
import { PasswordResetEmail } from '../email-templates/user/passwordResetEmail';
import { useAuthStore } from '../store/auth';
import { env } from '../lib/env';

const EmailTest = () => {
  const [email, setEmail] = useState('ngcobomthunzi389@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<'email' | 'password-reset' | 'custom-reset'>('email');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { resetPassword, resetPasswordCustom } = useAuthStore();

  const testEmail = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setDebugInfo(null);

    try {
      console.log('=== EMAIL SERVICE TEST STARTED ===');
      console.log('Testing email service...');
      console.log('Email endpoint:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`);
      console.log('Target email:', email);
      console.log('Has anon key:', !!env.supabase.anonKey);
      
      const response = await sendEmail({
        to: email,
        subject: 'Test Email - Password Reset',
        reactTemplate: PasswordResetEmail({
          firstName: 'Test User',
          resetLink: 'https://example.com/reset-password?token=test123'
        }),
      });

      console.log('Email service response:', response);
      setResult('Email sent successfully! Check the inbox.');
      setDebugInfo({ 
        success: true, 
        response, 
        endpoint: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('=== EMAIL SERVICE ERROR ===');
      console.error('Email test error:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      setError(`Email failed: ${err.message}`);
      setDebugInfo({ 
        success: false, 
        error: err.message, 
        stack: err.stack,
        endpoint: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testPasswordReset = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setDebugInfo(null);

    try {
      console.log('=== PASSWORD RESET TEST STARTED ===');
      console.log('Testing password reset (Custom Email Service first)...');
      console.log('Current origin:', window.location.origin);
      console.log('Target email:', email);
      
      await resetPasswordCustom(email);
      setResult(`Custom password reset email sent! Check your inbox. Custom link format: ${window.location.origin}/reset-password?token=...&email=...`);
      setDebugInfo({ 
        success: true, 
        method: 'custom',
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('=== CUSTOM PASSWORD RESET ERROR ===');
      console.error('Custom password reset error:', err);
      console.error('Error message:', err.message);
      
      try {
        console.log('=== TRYING SUPABASE PASSWORD RESET AS FALLBACK ===');
        console.log('Trying Supabase password reset as fallback...');
        console.log('Redirect URL will be:', `${window.location.origin}/reset-password`);
        
        await resetPassword(email);
        setResult(`Supabase password reset email sent (fallback)! Check your inbox. Redirect URL: ${window.location.origin}/reset-password`);
        setDebugInfo({ 
          success: true, 
          method: 'supabase-fallback',
          customError: err.message,
          redirectUrl: `${window.location.origin}/reset-password`,
          timestamp: new Date().toISOString()
        });
      } catch (supabaseErr: any) {
        console.error('=== SUPABASE PASSWORD RESET ERROR (FALLBACK) ===');
        console.error('Supabase password reset error:', supabaseErr);
        console.error('Supabase error message:', supabaseErr.message);
        
        setError(`Both password reset methods failed. Custom: ${err.message}, Supabase: ${supabaseErr.message}`);
        setDebugInfo({ 
          success: false, 
          customError: err.message,
          supabaseError: supabaseErr.message,
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomPasswordReset = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setDebugInfo(null);

    try {
      console.log('=== CUSTOM PASSWORD RESET TEST (FORCED) ===');
      console.log('Forcing custom password reset (bypassing Supabase)...');
      console.log('Target email:', email);
      
      await resetPasswordCustom(email);
      setResult(`Custom password reset email sent! Check your inbox. Custom link format: ${window.location.origin}/reset-password?token=...&email=...`);
      setDebugInfo({ 
        success: true, 
        method: 'custom-forced',
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('=== CUSTOM PASSWORD RESET ERROR (FORCED) ===');
      console.error('Custom password reset error:', err);
      console.error('Error message:', err.message);
      
      setError(`Custom password reset failed: ${err.message}`);
      setDebugInfo({ 
        success: false, 
        method: 'custom-forced',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = () => {
    if (testType === 'email') {
      testEmail();
    } else if (testType === 'password-reset') {
      testPasswordReset();
    } else if (testType === 'custom-reset') {
      testCustomPasswordReset();
    }
  };

  const handleClearDebug = () => {
    setResult(null);
    setError(null);
    setDebugInfo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Email & Password Reset Test</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-1">
              Test Type
            </label>
            <select
              id="testType"
              value={testType}
              onChange={(e) => setTestType(e.target.value as 'email' | 'password-reset' | 'custom-reset')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="email">Email Service Test</option>
              <option value="password-reset">Password Reset Test (Custom → Supabase)</option>
              <option value="custom-reset">Force Custom Password Reset Only</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Test Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleTest}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                testType === 'email' ? 'Sending Test Email...' : testType === 'password-reset' ? 'Testing Password Reset...' : 'Testing Custom Password Reset...'
              ) : (
                testType === 'email' ? 'Send Test Email' : testType === 'password-reset' ? 'Test Password Reset' : 'Test Custom Password Reset'
              )}
            </button>
            
            <button
              onClick={handleClearDebug}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>

          {result && (
            <div className="p-3 rounded bg-green-100 text-green-800">
              {result}
            </div>
          )}

          {error && (
            <div className="p-3 rounded bg-red-100 text-red-800">
              {error}
            </div>
          )}

          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded border">
              <h4 className="font-medium mb-2">Debug Information:</h4>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <h3 className="font-medium mb-2">Test Information:</h3>
            {testType === 'email' ? (
              <div>
                <p><strong>Email Service Test:</strong> Tests the custom email service using a sample password reset template.</p>
                <p className="mt-2"><strong>Endpoint:</strong> {import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email</p>
              </div>
            ) : testType === 'password-reset' ? (
              <div>
                <p><strong>Password Reset Test:</strong> Tests both custom and Supabase password reset flows.</p>
                <p className="mt-1">• First tries our custom email service (Resend)</p>
                <p className="mt-1">• Falls back to Supabase's built-in password reset if custom fails</p>
              </div>
            ) : (
              <div>
                <p><strong>Custom Password Reset Test:</strong> Tests the custom password reset flow only.</p>
                <p className="mt-1">• This test bypasses Supabase and only sends a custom password reset email.</p>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-1">Environment Info:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
                <p><strong>Has Anon Key:</strong> {env.supabase.anonKey ? 'Yes' : 'No'}</p>
                <p><strong>Current Origin:</strong> {window.location.origin}</p>
                <p><strong>Expected Redirect:</strong> {window.location.origin}/reset-password</p>
              </div>
              
              {window.location.origin.includes('localhost') && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h5 className="font-medium text-yellow-800 mb-1">⚠️ Development Mode Detected</h5>
                  <p className="text-sm text-yellow-700">
                    If password reset emails redirect to fitmomchloe.com instead of localhost, 
                    the Supabase project Site URL is set to production. 
                  </p>
                  <div className="mt-2 text-xs text-yellow-600">
                    <p><strong>Workaround:</strong> When you get redirected to production with an error, 
                    manually change the URL from 'fitmomchloe.com' to 'localhost:3001' in your browser.</p>
                  </div>
                </div>
              )}
              
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <h5 className="font-medium text-blue-800 mb-1">🔍 Debugging Tips</h5>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Check browser console for detailed error logs</li>
                  <li>• Verify Supabase Edge Function is deployed and working</li>
                  <li>• Check email spam/junk folders</li>
                  <li>• Ensure environment variables are properly set</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTest; 