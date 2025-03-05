import { supabase } from './supabase';
import { Booking } from '../types/booking';

/**
 * Sends an email notification to a user about their booking
 * This is a placeholder function that would be connected to a real email service
 */
export const sendBookingEmail = async (
  email: string, 
  subject: string, 
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // In a real application, you would integrate with an email service like SendGrid, AWS SES, etc.
    console.log(`Email would be sent to ${email} with subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // For development, just log the email and return success
    // In production, you would call your email service API here
    // await emailService.send({ to: email, subject, html: message });
    
    // For demonstration, we'll store a notification in a 'notifications' table if it exists
    try {
      await supabase
        .from('notifications')
        .insert([{
          recipient_email: email,
          subject,
          message,
          created_at: new Date().toISOString()
        }]);
    } catch (err) {
      // Table may not exist in the schema yet - this is okay for our demonstration
      console.log('Could not store notification in database', err);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Sends a booking cancellation notification
 */
export const sendBookingCancellationNotification = async (booking: Booking): Promise<{ success: boolean; error?: string }> => {
  if (!booking.email) {
    return { success: false, error: 'No email address provided' };
  }
  
  const subject = 'Your Booking Has Been Cancelled';
  const message = `
    <h1>Booking Cancelled</h1>
    <p>Hello ${booking.name || 'there'},</p>
    <p>We're sorry to inform you that your booking scheduled for <strong>${new Date(booking.date).toLocaleString()}</strong> has been cancelled by the administrator.</p>
    <p>Please contact us if you would like to reschedule.</p>
    <p>Thank you for your understanding.</p>
  `;
  
  return await sendBookingEmail(booking.email, subject, message);
};

/**
 * Sends a booking rescheduling notification
 */
export const sendBookingRescheduleNotification = async (
  booking: Booking, 
  oldDate: string
): Promise<{ success: boolean; error?: string }> => {
  if (!booking.email) {
    return { success: false, error: 'No email address provided' };
  }
  
  const oldDateTime = new Date(oldDate).toLocaleString();
  const newDateTime = new Date(booking.date).toLocaleString();
  
  const subject = 'Your Booking Has Been Rescheduled';
  const message = `
    <h1>Booking Rescheduled</h1>
    <p>Hello ${booking.name || 'there'},</p>
    <p>Your booking has been rescheduled:</p>
    <ul>
      <li>Previous time: <strong>${oldDateTime}</strong></li>
      <li>New time: <strong>${newDateTime}</strong></li>
    </ul>
    <p>If this new time doesn't work for you, please contact us as soon as possible.</p>
    <p>Thank you for your understanding.</p>
  `;
  
  return await sendBookingEmail(booking.email, subject, message);
}; 