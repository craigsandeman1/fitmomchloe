import { useState } from 'react';
import { debugAuth } from '../lib/authDebug';

const AuthTest = () => {
  const [email, setEmail] = useState('ngcobomthunzi389@gmail.com');
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<string>('');

  const addResult = (message: string) => {
    setResults(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + message);
  };

  const testSignup = async () => {
    addResult('Testing signup...');
    const result = await debugAuth.testSignup(email, password);
    if (result.error) {
      const errorMessage = typeof result.error === 'object' && result.error !== null && 'message' in result.error 
        ? (result.error as { message: string }).message 
        : 'Unknown error';
      addResult(`Signup error: ${errorMessage}`);
    } else {
      addResult(`Signup success: User created with ID ${result.data?.user?.id}`);
      addResult(`Email confirmed: ${!!result.data?.user?.email_confirmed_at}`);
    }
  };

  const testSignin = async () => {
    addResult('Testing signin...');
    const result = await debugAuth.testSignin(email, password);
    if (result.error) {
      const errorMessage = typeof result.error === 'object' && result.error !== null && 'message' in result.error 
        ? (result.error as { message: string }).message 
        : 'Unknown error';
      addResult(`Signin error: ${errorMessage}`);
    } else {
      addResult(`Signin success: User ${result.data?.user?.email}`);
    }
  };

  const checkCurrentUser = async () => {
    addResult('Checking current user...');
    const result = await debugAuth.getCurrentUser();
    if (result.user) {
      addResult(`Current user: ${result.user.email} (confirmed: ${!!result.user.email_confirmed_at})`);
    } else {
      addResult('No current user');
    }
  };

  const checkSession = async () => {
    addResult('Checking session...');
    const result = await debugAuth.getSession();
    if (result.session) {
      addResult(`Session exists for: ${result.session.user?.email}`);
    } else {
      addResult('No active session');
    }
  };

  const testCustomConfirmation = async () => {
    addResult('Testing custom confirmation flow...');
    const result = await debugAuth.testCustomConfirmation(email, password);
    
    if (result.success) {
      addResult(`✅ Custom confirmation test success!`);
      addResult(`Step: ${result.step}`);
      if (result.confirmationUrl) {
        addResult(`🔗 Confirmation URL: ${result.confirmationUrl}`);
        addResult(`📋 Copy this URL to test confirmation`);
      }
    } else {
      addResult(`❌ Custom confirmation test failed at step: ${result.step}`);
      addResult(`Error: ${result.error || 'Unknown error'}`);
    }
  };

  const testTokenValidation = async () => {
    const token = prompt('Enter the token from the URL to test validation:');
    if (!token) return;
    
    addResult(`Testing token validation for: ${token.substring(0, 20)}...`);
    try {
      const result = await debugAuth.testTokenValidation(token);
      addResult(`✅ Token validation success!`);
      addResult(`Email: ${result.email}`);
      addResult(`Message: ${result.message}`);
    } catch (error: any) {
      addResult(`❌ Token validation failed: ${error.message}`);
    }
  };

  const clearResults = () => {
    setResults('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Auth Debug Test</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Panel - Test Controls */}
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Basic Tests</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={testSignup}
                        className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                      >
                        Test Signup
                      </button>
                      <button
                        onClick={testSignin}
                        className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                      >
                        Test Signin
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Custom Confirmation</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={testCustomConfirmation}
                        className="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600"
                      >
                        Test Custom Confirmation Flow
                      </button>
                      <button
                        onClick={testTokenValidation}
                        className="bg-indigo-500 text-white px-4 py-2 rounded text-sm hover:bg-indigo-600"
                      >
                        Test Token Validation
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Session Tests</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={checkCurrentUser}
                        className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
                      >
                        Check User
                      </button>
                      <button
                        onClick={checkSession}
                        className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
                      >
                        Check Session
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={clearResults}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                  >
                    Clear Results
                  </button>
                </div>
              </div>
              
              {/* Right Panel - Results */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Test Results</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {results || 'No results yet. Run a test to see output.'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest; 