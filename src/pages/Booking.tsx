import { useState, useEffect } from 'react';
import { format, parseISO, isAfter, addDays, isEqual } from 'date-fns';
import { useBookingStore } from '../store/booking';
import { useAuthStore } from '../store/auth';
import useWeb3Forms from '@web3forms/react';
import { AlertCircle, CheckCircle, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Auth } from '../components/Auth';

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

  useEffect(() => {
    if (user) {
      fetchUserBookings();
      fetchAvailableTimeSlots();
      setName(user.user_metadata?.full_name || '');
    }
  }, [user, fetchUserBookings, fetchAvailableTimeSlots]);

  useEffect(() => {
    if (selectedDate) {
      const availableTimes = getAvailableTimesForDate(selectedDate);
      setAvailableTimes(availableTimes);
      // Clear selected time if it's no longer available
      if (selectedTime && !availableTimes.includes(selectedTime)) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, bookings, getAvailableTimesForDate, selectedTime]);

  const isTimeSlotAvailable = (date: string, time: string): boolean => {
    // First check if the time slot is configured as available
    if (availableTimes.length > 0 && !availableTimes.includes(time)) {
      return false;
    }
    
    // Then check if there's already a booking for this date and time
    const dateTime = `${date}T${time}:00`;
    return !bookings.some(booking => 
      booking.date === dateTime && booking.status !== 'cancelled'
    );
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
      
      const bookingData = {
        date: `${selectedDate}T${selectedTime}:00`,
        name: userName,
        notes: notes,
        email: user.email // Make sure email is included
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

  return (
    <div className="section-container py-20">
      <h1 className="font-playfair text-4xl mb-8 text-center">Book a Session</h1>
      
      {!user ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login to Book</h2>
          <div className="hide-signup">
            <Auth />
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
                        availableTimes.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            disabled={!isTimeSlotAvailable(selectedDate, time)}
                            className={`
                              p-2 border rounded-md text-center transition-colors
                              ${
                                selectedTime === time 
                                  ? 'bg-primary text-white border-primary' 
                                  : isTimeSlotAvailable(selectedDate, time)
                                    ? 'hover:bg-primary hover:text-white hover:border-primary'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }
                            `}
                          >
                            {time}
                          </button>
                        ))
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
                  const bookingDate = parseISO(booking.date);
                  return (
                    <div
                      key={booking.id}
                      className="border p-4 rounded-md hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {format(bookingDate, 'PPPP')}
                          </p>
                          <p className="text-gray-600">
                            {format(bookingDate, 'p')}
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