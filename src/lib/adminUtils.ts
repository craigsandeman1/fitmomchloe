import { supabase } from './supabase';

/**
 * Check admin status in both profiles.is_admin and admin_users table
 * @returns Object containing admin status from both sources
 */
export const verifyAdminStatus = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return {
        isAuthenticated: false,
        profilesIsAdmin: false,
        inAdminUsersTable: false,
        error: userError?.message || 'User not authenticated'
      };
    }
    
    // Check profiles.is_admin status
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error checking profiles.is_admin:', profileError);
    }
    
    // Check admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id);
    
    if (adminError) {
      console.error('Error checking admin_users table:', adminError);
    }
    
    return {
      isAuthenticated: true,
      userId: user.id,
      email: user.email,
      profilesIsAdmin: !!profileData?.is_admin,
      inAdminUsersTable: Array.isArray(adminData) && adminData.length > 0,
      profileError: profileError?.message,
      adminError: adminError?.message
    };
  } catch (error) {
    console.error('Unexpected error in verifyAdminStatus:', error);
    return {
      isAuthenticated: false,
      profilesIsAdmin: false,
      inAdminUsersTable: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Helper function to use in development to check and log admin status
 */
export const debugAdminStatus = async () => {
  const status = await verifyAdminStatus();
  console.log('Admin Status Debug:', status);
  return status;
};

/**
 * Helper to synchronize admin status between profiles and admin_users
 * Requires row-level security permissions or service role key
 */
export const syncAdminStatus = async (makeAdmin = true) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return { success: false, error: userError?.message || 'User not authenticated' };
    }
    
    // Update profiles.is_admin
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_admin: makeAdmin })
      .eq('id', user.id);
    
    if (profileError) {
      console.error('Error updating profiles.is_admin:', profileError);
      return { success: false, error: profileError.message };
    }
    
    // Update admin_users table
    if (makeAdmin) {
      // Add to admin_users
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert({ id: user.id });
      
      if (adminError) {
        console.error('Error updating admin_users table:', adminError);
        return { success: false, error: adminError.message };
      }
    } else {
      // Remove from admin_users
      const { error: removeError } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', user.id);
      
      if (removeError) {
        console.error('Error removing from admin_users table:', removeError);
        return { success: false, error: removeError.message };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in syncAdminStatus:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}; 