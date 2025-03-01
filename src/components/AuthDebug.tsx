import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { verifyAdminStatus } from '../lib/adminUtils';
import { supabase } from '../lib/supabase';

/**
 * This component helps debug authentication issues by displaying the current auth state
 * Add it temporarily to any page that's having auth issues
 */
const AuthDebug = () => {
  const { user, loading } = useAuthStore();
  const [adminStatus, setAdminStatus] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const status = await verifyAdminStatus();
      setAdminStatus(status);
    };

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    checkAdmin();
    getSession();
  }, [user]);

  if (!visible) return (
    <button 
      onClick={() => setVisible(true)}
      className="fixed bottom-4 right-4 bg-primary text-white p-2 rounded-md shadow-md"
    >
      Show Auth Debug
    </button>
  );

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-md shadow-lg border border-gray-200 max-w-md text-xs overflow-auto max-h-[80vh]">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">Auth Debug Info</h3>
        <button 
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Hide
        </button>
      </div>
      
      <div className="mb-2">
        <strong>Loading:</strong> {loading ? 'True' : 'False'}
      </div>
      
      <div className="mb-2">
        <strong>User Authenticated:</strong> {user ? 'Yes' : 'No'}
        {user && (
          <div className="pl-4 mt-1">
            <div><strong>User ID:</strong> {user.id}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at || '').toLocaleString()}</div>
          </div>
        )}
      </div>
      
      {adminStatus && (
        <div className="mb-2">
          <strong>Admin Status:</strong>
          <div className="pl-4 mt-1">
            <div><strong>Is Admin (profiles):</strong> {adminStatus.profilesIsAdmin ? 'Yes' : 'No'}</div>
            <div><strong>In admin_users table:</strong> {adminStatus.inAdminUsersTable ? 'Yes' : 'No'}</div>
            {adminStatus.profileError && (
              <div className="text-red-500"><strong>Profile Error:</strong> {adminStatus.profileError}</div>
            )}
            {adminStatus.adminError && (
              <div className="text-red-500"><strong>Admin Error:</strong> {adminStatus.adminError}</div>
            )}
          </div>
        </div>
      )}
      
      {session && (
        <div className="mb-2">
          <strong>Session:</strong>
          <div className="pl-4 mt-1">
            <div><strong>Provider:</strong> {session.provider_token ? session.provider_token : 'email'}</div>
            <div><strong>Expires:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-4">
        <button
          onClick={async () => {
            const status = await verifyAdminStatus();
            setAdminStatus(status);
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
          }}
          className="bg-primary text-white px-3 py-1 rounded-md text-xs"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default AuthDebug; 