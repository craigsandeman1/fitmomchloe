import { useEffect, useState, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';

const ProtectedAdminRoute = () => {
  const { user, loading } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const adminCheckRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      // Skip if we have already checked
      if (adminCheckRef.current) return;
      
      // If still loading auth state, wait
      if (loading) return;
      
      adminCheckRef.current = true;

      // If no user, we don't need to check admin status
      if (!user) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data?.is_admin);
        }
      } catch (err) {
        console.error('Error in admin check:', err);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [user, loading]);

  if (isCheckingAdmin || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, but save the current location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedAdminRoute; 