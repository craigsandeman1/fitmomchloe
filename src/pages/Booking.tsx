import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, isAfter, addDays, isEqual } from 'date-fns';
import { useBookingStore } from '../store/booking';
import { useAuthStore } from '../store/auth';
import useWeb3Forms from '@web3forms/react';
import { AlertCircle, CheckCircle, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Auth } from '../components/Auth';
import { type Booking as BookingType, BookingStatus } from '../types/booking';

const Booking = () => {
  const { user } = useAuthStore();
  const { bookings, fetchUserBookings, createBooking, cancelBooking, error, fetchAvailableTimeSlots, getAvailableTimesForDate } = useBookingStore();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [showReschedulePrompt, setShowReschedulePrompt] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [allSystemBookings, setAllSystemBookings] = useState<BookingType[]>([]);
  
  // Web3Forms setup
  const { submit } = useWeb3Forms({
    access_key: '396876a7-1dbb-48d5-9c8c-74ef7ff0e872',
    settings: {
      from_name: 'Fit Mom Chloe Booking',
      subject: 'New Booking Notification',
    },
    onSuccess: () => {
      setIsSendingEmail(false);
    },
    onError: () => {
      setEmailError(true);
      setIsSendingEmail(false);
    },
  });

  // Use useCallback for fetchAllSystemBookings to avoid dependency loops
  const fetchAllSystemBookings = useCallback(async () => {
    try {
      console.log('Fetching all system bookings...');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .neq('status', 'cancelled')
        .order('date', { ascending: true });
        
      if (error) throw error;
      setAllSystemBookings(data || []);
      console.log(`Fetched ${data?.length || 0} system bookings`);
    } catch (err) {
      console.error('Error fetching all bookings:', err);
    }
  }, []);
  
  // Fetch all bookings when the component mounts
  useEffect(() => {
    fetchAllSystemBookings();
    
    // Set up periodic refresh of all bookings (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchAllSystemBookings();
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchAllSystemBookings]);
  
  // Fetch bookings when user logs in
  useEffect(() => {
    if (user) {
      fetchUserBookings();
      fetchAvailableTimeSlots();
      fetchAllSystemBookings(); // Also refresh all bookings when user logs in
      setUserName(user.user_metadata?.full_name || '');
    }
  }, [user, fetchUserBookings, fetchAvailableTimeSlots, fetchAllSystemBookings]);

  // Update available times when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const availableTimes = getAvailableTimesForDate(selectedDate);
      setAvailableTimes(availableTimes);
      // Clear selected time if it's no longer available
      if (selectedTime && !availableTimes.includes(selectedTime)) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, bookings, getAvailableTimesForDate, selectedTime, allSystemBookings]);

  // Add real-time subscription to bookings
  useEffect(() => {
    // Set up Supabase real-time subscription to bookings table
    const subscription = supabase
      .channel('bookings_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings' 
        }, 
        (payload) => {
          console.log('Real-time booking update received:', payload);
          // Refresh all bookings when there's any change to the bookings table
          fetchAllSystemBookings();
          
          // Also refresh user's bookings if they're logged in
          if (user) {
            fetchUserBookings();
          }
          
          // If we have a selected date, refresh available times
          if (selectedDate) {
            const availableTimes = getAvailableTimesForDate(selectedDate);
            setAvailableTimes(availableTimes);
            
            // Clear selected time if it's no longer available
            if (selectedTime && !availableTimes.includes(selectedTime)) {
              setSelectedTime('');
              setErrorMessage('This time slot is no longer available. Please select another time.');
            }
          }
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, fetchUserBookings, fetchAllSystemBookings, selectedDate, selectedTime, getAvailableTimesForDate]);

  const isTimeSlotAvailable = (date: string, time: string): boolean => {
    // Check if the time is in availableTimes
    const slotAvailable = availableTimes.includes(time);
    if (!slotAvailable) return false;
    
    // This date is available in system configuration, now check if it's already booked
    const formattedDate = `${date}T${time}:00`;
    
    // Check if there's already a booking at this time from ANY user
    const existingBooking = allSystemBookings.find(booking => {
      const bookingDate = new Date(booking.date);
      const slotDate = new Date(formattedDate);
      return bookingDate.getTime() === slotDate.getTime() && booking.status !== 'cancelled';
    });
    
    return !existingBooking;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !userName.trim()) return;
    
    setSubmitting(true);
    
    try {
      // Get user's email from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        throw new Error('Cannot retrieve user email. Please try again or contact support.');
      }
      
      // IMPORTANT: Store the date/time exactly as selected - no timezone conversion
      // Format: 2024-03-18T14:00:00
      const exactTimeString = `${selectedDate}T${selectedTime}:00`;
      
      console.log('Storing exact selected time (no timezone conversion):', exactTimeString);
      
      // Check one more time if the slot is still available
      if (!isTimeSlotAvailable(selectedDate, selectedTime)) {
        throw new Error('This time slot has just been booked by someone else. Please select another time.');
      }
      
      const bookingData = {
        date: exactTimeString, // Store the exact string without timezone conversion
        name: userName,
        notes: notes,
        email: user.email
      };
      
      const result = await createBooking(bookingData);
      
      if (result) {
        setSuccessMessage('Booking confirmed. Thank you!');
        setUserName('');
        setNotes('');
        
        // Send confirmation email
        await sendEmailNotification({
          name: userName,
          email: user.email,
          date: selectedDate,
          time: selectedTime,
          notes: notes,
          bookingId: result.id
        });
        
        // Refresh all bookings to ensure the UI is updated for all users
        fetchUserBookings();
        fetchAllSystemBookings();
        
        // Reset form
        setSelectedDate('');
        setSelectedTime('');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const sendEmailNotification = async (bookingInfo: {
    name: string;
    email: string;
    date: string;
    time: string;
    notes: string;
    bookingId: string;
  }) => {
    try {
      setIsSendingEmail(true);
      setEmailError(false);
      
      await submit({
        name: bookingInfo.name,
        email: bookingInfo.email,
        message: `
          New booking created!
          
          Name: ${bookingInfo.name}
          Email: ${bookingInfo.email}
          Date: ${bookingInfo.date}
          Time: ${bookingInfo.time}
          Notes: ${bookingInfo.notes || 'None'}
          Booking ID: ${bookingInfo.bookingId}
        `,
        botcheck: '',
      });
    } catch (err) {
      console.error('Error sending email notification:', err);
      setEmailError(true);
    }
  };

  const handleCancelBookingInitiate = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancelConfirm(true);
  };

  const handleCancelBookingConfirm = async () => {
    if (!bookingToCancel) return;
    
    try {
      setIsLoading(true);
      const cancelledBooking = bookings.find(b => b.id === bookingToCancel);
      
      if (cancelledBooking) {
        await cancelBooking(bookingToCancel);
        setCancelSuccess(true);
        
        // Send cancellation notification
        sendCancellationNotification(cancelledBooking);
        
        // Show reschedule prompt
        setShowReschedulePrompt(true);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsLoading(false);
      setShowCancelConfirm(false);
      setBookingToCancel(null);
    }
  };

  const sendCancellationNotification = async (booking: any) => {
    try {
      setIsSendingEmail(true);
      setEmailError(false);
      
      const bookingDate = parseISO(booking.date);
      
      await submit({
        name: booking.name || user?.user_metadata?.full_name || 'User',
        email: user?.email || '',
        message: `
          A booking has been cancelled!
          
          Name: ${booking.name || user?.user_metadata?.full_name || 'Not provided'}
          Email: ${user?.email || 'Not provided'}
          Original Date: ${format(bookingDate, 'PPPP')}
          Original Time: ${format(bookingDate, 'p')}
          Booking ID: ${booking.id}
        `,
        botcheck: '',
      });
    } catch (err) {
      console.error('Error sending cancellation notification:', err);
      setEmailError(true);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = addDays(new Date(), 1);
    return format(tomorrow, 'yyyy-MM-dd');
  };

  // Filter bookings to show only upcoming and not cancelled
  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = parseISO(booking.date);
    return (
      booking.status !== 'cancelled' &&
      (isAfter(bookingDate, new Date()) || isEqual(format(bookingDate, 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')))
    );
  });

  // Sort bookings by date (most recent first)
  const sortedBookings = [...upcomingBookings].sort((a, b) => {
    return parseISO(a.date).getTime() - parseISO(b.date).getTime();
  });

  // Standardize time format display with helper function
  const formatTimeDisplay = (time: string): string => {
    // Convert 24-hour time (HH:MM) to 24-hour format consistently
    return time + ':00';
  };

  // Add visual feedback when a slot becomes unavailable
  const renderTimeSlot = (time: string) => {
    const isAvailable = isTimeSlotAvailable(selectedDate, time);
    const isSelected = selectedTime === time;
    let className = `p-2 border rounded-md text-center transition-colors`;
    
    if (isSelected) {
      className += ' bg-primary text-white border-primary';
    } else if (isAvailable) {
      className += ' hover:bg-primary hover:text-white hover:border-primary';
    } else {
      className += ' bg-gray-100 text-gray-400 cursor-not-allowed relative';
    }
    
    return (
      <button
        key={time}
        type="button"
        onClick={() => isAvailable && setSelectedTime(time)}
        disabled={!isAvailable}
        className={className}
      >
        {time}
        {!isAvailable && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-red-500 h-0.5 w-full absolute transform rotate-45"></span>
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="section-container py-20">
      <h1 className="font-playfair text-4xl mb-8 text-center">Book a Session</h1>
      
      {!user ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {showSignUp ? 'Create an Account' : 'Login to Book'}
          </h2>
          
          <div className={showSignUp ? '' : 'hide-signup'}>
            <Auth />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              {showSignUp 
                ? 'Already have an account?' 
                : "Don't have an account yet?"}
            </p>
            <button 
              onClick={() => setShowSignUp(!showSignUp)}
              type="button"
              className="btn-primary w-full"
            >
              {showSignUp ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Calendar className="mr-2 text-primary" />
              Book Your Slot
            </h2>
            
            {success ? (
              <div className="bg-green-50 p-4 rounded-md mb-4 flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800">Booking Confirmed!</h3>
                  <p className="text-green-700">Your session has been booked successfully.</p>
                  <button 
                    onClick={() => setSuccess(false)} 
                    className="mt-2 text-sm text-green-600 underline"
                  >
                    Book another session
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.length > 0 ? (
                        availableTimes.map((time) => renderTimeSlot(time))
                      ) : (
                        <p className="col-span-3 text-center py-2 text-gray-500">
                          No available time slots for this date
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Any special requirements or questions?"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!selectedDate || !selectedTime || submitting}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    (!selectedDate || !selectedTime || submitting) && 'opacity-70 cursor-not-allowed'
                  }`}
                >
                  {submitting ? 'Booking...' : 'Book Now'}
                </button>
                
                {errorMessage && (
                  <div className="text-red-500 flex items-center mt-2">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errorMessage}</span>
                  </div>
                )}
              </form>
            )}
          </div>
          
          {/* Current Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Clock className="mr-2 text-primary" />
              Your Bookings
            </h2>
            
            {isLoading ? (
              <p className="text-center py-4">Loading your bookings...</p>
            ) : sortedBookings.length > 0 ? (
              <div className="space-y-4">
                {sortedBookings.map((booking) => {
                  // IMPORTANT: Parse the date without timezone conversion
                  // Split the ISO string to extract date and time parts directly
                  const dateTimeParts = booking.date.split('T');
                  const datePart = dateTimeParts[0]; // e.g., "2024-03-18"
                  const timePart = dateTimeParts[1].substring(0, 5); // e.g., "14:00" (strip seconds)
                  
                  // Parse the date for formatting the day name and month
                  const dateObj = new Date(datePart + 'T00:00:00');
                  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                  const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
                  const day = dateObj.getDate();
                  const year = dateObj.getFullYear();
                  
                  // Create a nicely formatted date string
                  const formattedDate = `${dayOfWeek}, ${month} ${day}, ${year}`;
                  
                  // Display the exact time string that was selected (from the database)
                  const formattedTime = timePart;
                  
                  return (
                    <div
                      key={booking.id}
                      className="border p-4 rounded-md hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {formattedDate}
                          </p>
                          <p className="text-gray-600">
                            {formattedTime}
                          </p>
                          {booking.notes && (
                            <p className="text-gray-500 text-sm mt-2">
                              Notes: {booking.notes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleCancelBookingInitiate(booking.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any upcoming bookings.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Book a session using the form to get started!
                </p>
              </div>
            )}
            
            {cancelSuccess && (
              <div className="mt-4 bg-green-50 p-4 rounded-md flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800">Booking Cancelled</h3>
                  <p className="text-green-700">Your booking has been cancelled successfully.</p>
                </div>
              </div>
            )}
            
            {emailError && (
              <div className="mt-4 bg-yellow-50 p-4 rounded-md flex items-start">
                <AlertCircle className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Notification Issue</h3>
                  <p className="text-yellow-700">There was an issue sending the email notification, but your booking change was processed successfully.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Cancellation Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Cancel Booking</h3>
            <p className="mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setBookingToCancel(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelBookingConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reschedule Prompt Modal */}
      {showReschedulePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Would you like to reschedule?</h3>
            <p className="mb-6">Would you like to book another session for a different date and time?</p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => {
                  setShowReschedulePrompt(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                No, Thanks
              </button>
              <button
                onClick={() => {
                  setShowReschedulePrompt(false);
                  setSuccess(false);
                  setSelectedDate('');
                  setSelectedTime('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Yes, Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;