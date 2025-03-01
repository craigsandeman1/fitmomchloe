import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from '../components/Auth';
import { useAuthStore } from '../store/auth';
import AuthDebug from '../components/AuthDebug';
import SEO from '../components/SEO';
import { verifyAdminStatus } from '../lib/adminUtils';

const Login = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  
  // Get the return URL from the location state or default to home
  const from = location.state?.from || '/';
  
  // If user is already logged in, check admin status and redirect appropriately
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!user) return;
      
      // Prevent duplicate checks
      if (isCheckingAdmin) return;
      
      try {
        setIsCheckingAdmin(true);
        
        // Check if the user is an admin
        const adminStatus = await verifyAdminStatus();
        console.log('Admin status check:', adminStatus);
        
        if (adminStatus.profilesIsAdmin) {
          // If admin, redirect to admin dashboard
          console.log('User is admin, redirecting to admin dashboard');
          navigate('/admin', { replace: true });
        } else {
          // If not admin, redirect to the original destination or home
          console.log('User is not admin, redirecting to:', from);
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        // If there's an error, just redirect to the original destination
        navigate(from, { replace: true });
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    checkUserAndRedirect();
  }, [user, navigate, from, isCheckingAdmin]);

  // Handle auth success - immediately check admin status
  const handleAuthSuccess = async () => {
    // This is called immediately after successful authentication
    // We don't need to check if user exists since we know they just authenticated
    try {
      setIsCheckingAdmin(true);
      
      // Allow a brief pause for the auth state to update fully
      setTimeout(async () => {
        const adminStatus = await verifyAdminStatus();
        console.log('Auth success admin check:', adminStatus);
        
        if (adminStatus.profilesIsAdmin) {
          console.log('User is admin, redirecting to admin dashboard');
          navigate('/admin', { replace: true });
        } else {
          console.log('User is not admin, redirecting to:', from);
          navigate(from, { replace: true });
        }
        setIsCheckingAdmin(false);
      }, 500);
    } catch (error) {
      console.error('Error checking admin status after auth:', error);
      navigate(from, { replace: true });
      setIsCheckingAdmin(false);
    }
  };

  return (
    <div className="pt-8 pb-16 bg-background">
      <SEO 
        title="Access Exclusive Fitness Content | Member Login | Fit Mom Chloe" 
        description="Sign in to unlock premium workout videos, personalized meal plans, and exclusive fitness content. What transformations are waiting for you on the other side?" 
        canonicalUrl="/login"
      />
      <div className="section-container">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-playfair text-primary mb-6 text-center">
            Sign In
          </h1>
          <p className="mb-6 text-gray-600 text-center">
            Sign in to your account to access exclusive content and features.
            {location.state?.from === '/admin' && (
              <span className="block mt-2 text-sm font-semibold">
                Admin access required
              </span>
            )}
          </p>
          <div className="hide-signup">
            <Auth onAuthSuccess={handleAuthSuccess} />
          </div>
          
          {isCheckingAdmin && (
            <div className="mt-4 text-center text-gray-500">
              <p>Checking admin status...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Debug component - remove in production */}
      <AuthDebug />
    </div>
  );
};

export default Login; 