import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmEmailWithToken } from '../lib/confirmationService';

const ConfirmEmail = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      // Get token from URL parameters
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No confirmation token provided');
        return;
      }

      try {
        const result = await confirmEmailWithToken(token);
        setStatus('success');
        setMessage(result.message);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login?confirmed=true');
        }, 3000);
        
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Confirmation failed');
      }
    };

    confirmEmail();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-playfair font-extrabold text-gray-900">
              Email Confirmation
            </h2>
            
            <div className="mt-8">
              {status === 'loading' && (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-gray-600">Confirming your email...</p>
                </div>
              )}
              
              {status === 'success' && (
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-green-900 mb-2">Success!</h3>
                  <p className="text-green-700 mb-4">{message}</p>
                  <p className="text-sm text-gray-500">Redirecting to login page...</p>
                </div>
              )}
              
              {status === 'error' && (
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-red-100 p-3 mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-red-900 mb-2">Confirmation Failed</h3>
                  <p className="text-red-700 mb-4">{message}</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                    >
                      Go to Login
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Go Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail; 