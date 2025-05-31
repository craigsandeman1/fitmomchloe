import { supabase } from './supabase';
import { sendEmail } from './emailService';
import { ConfirmationEmail } from '../email-templates/user/confirmationEmail';

// Generate a secure random token
export const generateConfirmationToken = (): string => {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
};

// Store confirmation token in Supabase
export const storeConfirmationToken = async (userId: string, email: string, token: string) => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

  const { error } = await supabase
    .from('confirmation_tokens')
    .insert({
      user_id: userId,
      email: email,
      token: token,
      expires_at: expiresAt.toISOString(),
      used: false
    });

  if (error) {
    console.error('Error storing confirmation token:', error);
    throw new Error('Failed to store confirmation token');
  }

  return token;
};

// Send custom confirmation email
export const sendConfirmationEmail = async (email: string, firstName: string, token: string) => {
  // Get the base URL - use environment variable in production, current origin in development
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const confirmationUrl = `${baseUrl}/confirm-email?token=${token}`;
  
  try {
    await sendEmail({
      to: email,
      subject: 'Confirm Your Email - Fit Mom',
      reactTemplate: ConfirmationEmail({ 
        firstName: firstName || 'there',
        confirmationUrl 
      }),
    });
    
    console.log('Confirmation email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};

// Validate and use confirmation token
export const confirmEmailWithToken = async (token: string) => {
  try {
    // First, get the token details
    const { data: tokenData, error: tokenError } = await supabase
      .from('confirmation_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (tokenError || !tokenData) {
      throw new Error('Invalid or expired confirmation token');
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      throw new Error('Confirmation token has expired');
    }

    // Mark token as used
    const { error: updateTokenError } = await supabase
      .from('confirmation_tokens')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('token', token);

    if (updateTokenError) {
      throw new Error('Failed to update token status');
    }

    // Confirm the user's email using admin function
    const { data: confirmResult, error: confirmError } = await supabase
      .rpc('confirm_user_email', { user_email: tokenData.email });

    if (confirmError) {
      console.error('Error confirming user email:', confirmError);
      throw new Error('Failed to confirm user email');
    }

    return {
      success: true,
      email: tokenData.email,
      message: 'Email confirmed successfully!'
    };

  } catch (error) {
    console.error('Confirmation error:', error);
    throw error;
  }
};

// Resend confirmation email
export const resendConfirmationEmail = async (email: string) => {
  try {
    // Check if user exists and is unconfirmed
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user || user.email !== email) {
      throw new Error('User not found or email mismatch');
    }

    if (user.email_confirmed_at) {
      throw new Error('Email is already confirmed');
    }

    // Generate new token
    const token = generateConfirmationToken();
    await storeConfirmationToken(user.id, email, token);

    // Send new confirmation email
    await sendConfirmationEmail(email, '', token);

    return {
      success: true,
      message: 'Confirmation email sent successfully'
    };

  } catch (error) {
    console.error('Resend confirmation error:', error);
    throw error;
  }
}; 