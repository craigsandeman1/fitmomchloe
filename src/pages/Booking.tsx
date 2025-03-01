import { useState, useEffect } from 'react';
import { format, addDays, isAfter, startOfToday, parseISO } from 'date-fns';
import { Calendar, Clock, Info, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useBookingStore } from '../store/booking';
import { Auth } from '../components/Auth';
import useWeb3Forms from '@web3forms/react';

const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
];

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const { user } = useAuthStore();
  const { bookings, loading, error, fetchUserBookings, createBooking, cancelBooking } = useBookingStore();

  // Web3Forms setup
  const { submit } = useWeb3Forms({
    access_key: '396876a7-1dbb-48d5-9c8c-74ef7ff0e872',
    settings: {
      from_name: 'Fit Mom Chloe Website',
      subject: 'New Booking Request',
    },
    onSuccess: (successMessage) => {
      console.log(successMessage);
      setFormSuccess(true);
      setSendingEmail(false);
      setTimeout(() => setFormSuccess(false), 5000);
    },
    onError: (errorMessage) => {
      console.error(errorMessage);
      setEmailError(errorMessage);
      setSendingEmail(false);
    }
  });

  useEffect(() => {
    if (user) {
      fetchUserBookings();
      // Pre-fill email from user's account
      setName(user.email?.split('@')[0] || '');
    }
  }, [fetchUserBookings, user]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !user) return;

    const dateTime = `${selectedDate}T${selectedTime}:00`;
    
    // Create booking in Supabase
    await createBooking({
      date: dateTime,
      name,
      email: user.email || '',
      notes,
      status: 'pending',
      user_id: user.id
    });

    // Send email notification via Web3Forms
    try {
      setSendingEmail(true);
      setEmailError(null);
      
      const formattedDate = format(parseISO(dateTime), 'EEEE, MMMM d, yyyy');
      const formattedTime = format(parseISO(dateTime), 'h:mm a');
      
      const formData = {
        name,
        email: user.email,
        message: `New booking request:
          
Date: ${formattedDate}
Time: ${formattedTime}
Name: ${name}
Email: ${user.email}
Notes: ${notes || 'No additional notes'}`,
        booking_date: formattedDate,
        booking_time: formattedTime,
        booking_notes: notes,
        notification_email: "sandemancraig@gmail.com", // This will be included in the email
      };

      await submit(formData);
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
    } catch (err) {
      console.error('Failed to send email notification:', err);
      setEmailError('Failed to send email notification. Please try again.');
      setSendingEmail(false);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = startOfToday();
    
    for (let i = 1; i <= 14; i++) {
      const date = addDays(today, i);
      dates.push(format(date, 'yyyy-MM-dd'));
    }
    
    return dates;
  };

  const isTimeSlotAvailable = (date: string, time: string) => {
    const dateTime = `${date}T${time}:00`;
    return !bookings.some(booking => 
      booking.date === dateTime && booking.status !== 'cancelled'
    );
  };

  if (!user) {
    return (
      <div className="section-container py-20">
        <h1 className="font-playfair text-4xl mb-8">Book a Session</h1>
        <div className="max-w-md mx-auto">
          <p className="text-gray-600 mb-8 text-center">
            Please sign in or create an account to book a session.
          </p>
          <Auth />
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-20">
      <h1 className="font-playfair text-4xl mb-8">Book a Session</h1>

      {/* Success Message */}
      {formSuccess && (
        <div className="mb-6 p-4 rounded-md bg-green-50 text-green-800 flex items-center">
          <CheckCircle className="mr-2" size={20} />
          <span>Booking successful! A confirmation has been sent to your email.</span>
        </div>
      )}

      {/* Web3Forms Error */}
      {emailError && (
        <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800">
          <p>There was an error sending the notification: {emailError}</p>
        </div>
      )}

      {/* Booking Form */}
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Choose a date</option>
                {getAvailableDates().map(date => (
                  <option key={date} value={date}>
                    {format(parseISO(date), 'EEEE, MMMM d')}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_TIMES.map(time => (
                    <button
                      key={time}
                      type="button"
                      disabled={!isTimeSlotAvailable(selectedDate, time)}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 border rounded-md ${
                        selectedTime === time
                          ? 'bg-primary text-white'
                          : !isTimeSlotAvailable(selectedDate, time)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'hover:bg-primary/10'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email || ''}
                className="w-full p-2 border rounded-md bg-gray-50"
                disabled
              />
              <p className="mt-1 text-sm text-gray-500">
                Email is automatically set from your account
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={loading || sendingEmail || !selectedDate || !selectedTime}
              className={`btn-primary w-full ${(loading || sendingEmail) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading || sendingEmail ? 'Booking...' : 'Book Session'}
            </button>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </form>
        </div>

        {/* Existing Bookings */}
        <div>
          <h2 className="font-playfair text-2xl mb-6">Your Bookings</h2>
          <div className="space-y-4">
            {bookings
              .filter(booking => isAfter(parseISO(booking.date), new Date()))
              .map(booking => (
                <div
                  key={booking.id}
                  className={`p-4 rounded-lg border ${
                    booking.status === 'cancelled'
                      ? 'bg-gray-50'
                      : booking.status === 'confirmed'
                      ? 'bg-green-50'
                      : 'bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar size={16} />
                        <span>{format(parseISO(booking.date), 'EEEE, MMMM d')}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock size={16} />
                        <span>{format(parseISO(booking.date), 'HH:mm')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Info size={16} />
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </div>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            {bookings.length === 0 && (
              <p className="text-gray-500">No upcoming bookings</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;