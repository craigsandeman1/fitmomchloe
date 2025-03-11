import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Trash2, AlertCircle } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  is_admin: boolean;
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, userName, userEmail }: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-semibold">Confirm User Deletion</h3>
        </div>
        
        <p className="mb-4">
          Are you sure you want to delete the user <span className="font-semibold">{userName || userEmail}</span>?
        </p>
        
        <p className="mb-6 text-sm text-gray-600">
          This action cannot be undone. The user will lose access to all their data and purchased content.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

const UsersList = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error fetching users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !currentStatus } : user
      ));
    } catch (err) {
      console.error('Error updating admin status:', err);
      setError('Error updating admin status. Please try again.');
    }
  };

  const handleDeleteUser = async (user: Profile) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      setError(null);
      
      // Delete user from auth.users (which cascades to profiles due to RLS)
      const { error } = await supabase.rpc('delete_user', {
        user_id: userToDelete.id
      });

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error deleting user. This may require admin database access.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-2xl font-semibold">Users</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 mb-6 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Admin Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Admin Actions</span>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || 'No name provided'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_admin
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                      className="text-primary hover:text-primary-dark"
                    >
                      {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-500 hover:text-red-700"
                      disabled={user.is_admin}
                      title={user.is_admin ? "Can't delete admin users" : "Delete user"}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        userName={userToDelete?.full_name || ''}
        userEmail={userToDelete?.email || ''}
      />
    </div>
  );
};

export default UsersList; 