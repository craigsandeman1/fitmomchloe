import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { verifyAdminStatus } from '../lib/adminUtils';

const AdminDebug = () => {
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const status = await verifyAdminStatus();
        setAdminInfo(status);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [user]);

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded shadow-md"
      >
        Show Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-md border border-gray-200 max-w-md max-h-[80vh] overflow-auto text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Admin Debug Panel</h3>
        <button onClick={() => setOpen(false)} className="text-gray-500">Close</button>
      </div>
      
      {loading ? (
        <p>Loading admin status...</p>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div>
          <div className="mb-1"><strong>User Authenticated:</strong> {adminInfo?.isAuthenticated ? 'Yes' : 'No'}</div>
          <div className="mb-1"><strong>User ID:</strong> {adminInfo?.userId || 'Not available'}</div>
          <div className="mb-1"><strong>Email:</strong> {adminInfo?.email || 'Not available'}</div>
          <div className="mb-1 text-green-600"><strong>Is Admin (profiles):</strong> {adminInfo?.profilesIsAdmin ? 'Yes' : 'No'}</div>
          <div className="mb-1 text-blue-600"><strong>In admin_users table:</strong> {adminInfo?.inAdminUsersTable ? 'Yes' : 'No'}</div>
          
          {adminInfo?.profileError && (
            <div className="text-red-500 mb-1"><strong>Profile Error:</strong> {adminInfo.profileError}</div>
          )}
          
          {adminInfo?.adminError && (
            <div className="text-red-500 mb-1"><strong>Admin Error:</strong> {adminInfo.adminError}</div>
          )}
          
          <div className="text-gray-500 mt-2 text-xs">Last updated: {new Date().toLocaleTimeString()}</div>
          
          <button 
            onClick={async () => {
              setLoading(true);
              try {
                const status = await verifyAdminStatus();
                setAdminInfo(status);
                setError(null);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
              } finally {
                setLoading(false);
              }
            }}
            className="mt-2 px-2 py-1 bg-gray-200 rounded text-xs"
          >
            Refresh Status
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDebug; 