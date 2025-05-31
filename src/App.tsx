import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MealPlans from './pages/MealPlans';
import MealPlansSimple from './pages/MealPlansSimple';
import Workouts from './pages/Workouts';
import WorkoutPlans from './pages/WorkoutPlans';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import PaymentResult from './pages/PaymentResult';
import PurchaseSuccess from './pages/PurchaseSuccess';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Login from './pages/Login';
import PayfastTest from './pages/PayfastTest';
import EmailPayfastTest from './pages/EmailPayfastTest';
import EmailTest from './pages/EmailTest';
import Contact from './pages/Contact';
import AuthTest from './pages/AuthTest';
import ConfirmEmail from './pages/ConfirmEmail';
import Footer from './components/Footer';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/auth';
// Import debug utility for development
import './lib/authDebug';

// Component to handle Supabase authentication errors from URL hash
const SupabaseErrorHandler = ({ onErrorHandled }: { onErrorHandled: () => void }) => {
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Check for Supabase errors in URL hash
    const hash = window.location.hash;
    if (hash.includes('error=')) {
      const urlParams = new URLSearchParams(hash.substring(1));
      const errorType = urlParams.get('error');
      const errorCode = urlParams.get('error_code');
      const errorDescription = urlParams.get('error_description');

      console.log('Supabase auth error detected:', { errorType, errorCode, errorDescription });

      let userFriendlyMessage = '';
      if (errorCode === 'otp_expired' || errorDescription?.includes('expired')) {
        userFriendlyMessage = 'The password reset link has expired. Please request a new password reset link.';
      } else if (errorType === 'access_denied') {
        userFriendlyMessage = 'Access denied. The link may be invalid or expired. Please try requesting a new password reset.';
      } else {
        userFriendlyMessage = errorDescription?.replace(/\+/g, ' ') || 'An authentication error occurred. Please try again.';
      }

      setError(userFriendlyMessage);
      setShowError(true);

      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleDismiss = () => {
    setShowError(false);
    setError(null);
    onErrorHandled();
  };

  if (!showError || !error) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-50 px-4">
      <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Password Reset Link Error
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => window.location.href = '/meal-plans'}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Try Password Reset Again
              </button>
              <button
                onClick={handleDismiss}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cookie Consent Banner Component
const CookieConsent = ({ onAccept }: { onAccept: () => void }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          This website uses cookies to ensure you get the best experience. By continuing to use this site, you consent to our use of cookies.
          <a href="/privacy-policy" className="text-primary underline ml-1">Learn more</a>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onAccept}
            className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] text-white px-4 py-2 rounded-md text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showSupabaseError, setShowSupabaseError] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    // Only show cookie consent if user hasn't already given consent
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowCookieConsent(true);
    }

    // Initialize the current user session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('User already logged in:', session.user.email);
      }
    };

    initializeAuth();
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieConsent(false);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowCookieConsent(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col w-full max-w-[100vw] overflow-x-hidden">
        <Navbar />
        {showSupabaseError && (
          <SupabaseErrorHandler onErrorHandled={() => setShowSupabaseError(false)} />
        )}
        <main className="flex-grow pt-16 w-full max-w-[100vw] overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/meal-plans-simple" element={<MealPlansSimple />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workout-plans" element={<WorkoutPlans />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/payment/success" element={<PaymentResult />} />
            <Route path="/payment/cancel" element={<PaymentResult />} />
            <Route path="/purchase/success" element={<PurchaseSuccess />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payfast-test" element={<PayfastTest />} />
            <Route path="/email-payfast-test" element={<EmailPayfastTest />} />
            <Route path="/email-test" element={<EmailTest />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
          </Routes>
        </main>
        <Footer />
        {showCookieConsent && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm">
                We use cookies to enhance your experience on our site. By continuing to browse, you agree to our use of cookies.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleAcceptCookies}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={handleDeclineCookies}
                  className="px-4 py-2 border border-gray-400 text-gray-300 rounded hover:bg-gray-800 transition-colors text-sm"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
