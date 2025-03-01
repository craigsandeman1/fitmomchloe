// This script sets admin status for a user in the profiles table
// Run with: node src/scripts/set_admin.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ADMIN_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to set admin status by email
async function setAdminByEmail(email, isAdmin = true) {
  if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
  }

  try {
    console.log(`Setting admin status to ${isAdmin} for user with email: ${email}`);
    
    // First, get the user ID from the auth.users table
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('Error finding user:', userError.message);
      return;
    }

    if (!userData) {
      console.error(`No user found with email: ${email}`);
      return;
    }

    const userId = userData.id;
    
    // Update the user's admin status in the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId);

    if (error) {
      console.error('Error updating admin status:', error.message);
      return;
    }

    console.log(`Successfully updated admin status for user with email: ${email}`);
    
    // Also ensure the user is in the admin_users table if isAdmin is true
    if (isAdmin) {
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert({ id: userId })
        .select();

      if (adminError) {
        console.error('Error updating admin_users table:', adminError.message);
        return;
      }
      
      console.log(`Successfully added user to admin_users table.`);
    } else {
      // Remove from admin_users if setting to false
      const { error: removeError } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);
        
      if (removeError) {
        console.error('Error removing from admin_users table:', removeError.message);
        return;
      }
      
      console.log(`Successfully removed user from admin_users table.`);
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Get email from command line arguments
const email = process.argv[2];
const isAdmin = process.argv[3] !== 'false'; // Any value other than 'false' will be treated as true

if (!email) {
  console.error('Please provide an email address as a command line argument.');
  console.log('Usage: node set_admin.js <email> [true|false]');
  console.log('Example: node set_admin.js admin@example.com true');
  process.exit(1);
}

setAdminByEmail(email, isAdmin)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  }); 