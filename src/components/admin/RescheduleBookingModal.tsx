import { useState, useEffect } from 'react';
import { Booking } from '../../types/booking';
import { format, parseISO, addDays } from 'date-fns';
import { Calendar, Clock, X } from 'lucide-react';
import { useBookingStore } from '../../store/booking';

interface RescheduleBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onReschedule?: (bookingId: string, newDate: string) => Promise<void>;
}

const RescheduleBookingModal = ({ booking, onClose, onReschedule }: RescheduleBookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { availableTimeSlots, fetchAvailableTimeSlots, bookings, fetchAllBookings, getAvailableTimesForDate } = useBookingStore();
  
  // Format the current booking date for display
  const currentBookingDate = format(parseISO(booking.date), 'EEEE, MMMM d, yyyy');
  const currentBookingTime = format(parseISO(booking.date), 'h:mm a');
  
  // Set default selected date to current booking date
  useEffect(() => {
    setSelectedDate(format(parseISO(booking.date), 'yyyy-MM-dd'));
  }, [booking]);
  
  // Load time slots and all bookings
  useEffect(() => {
    const loadData = async () => {
      await fetchAvailableTimeSlots();
      await fetchAllBookings();
    };
    
    loadData();
  }, [fetchAvailableTimeSlots, fetchAllBookings]);
  
  // Get available times for selected date
  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];
  
  // Filter available times that are already booked
  const existingBookings = bookings.filter(b => 
    format(parseISO(b.date), 'yyyy-MM-dd') === selectedDate && 
    b.id !== booking.id && 
    b.status !== 'cancelled'
  );
  
  const existingTimes = existingBookings.map(b => format(parseISO(b.date), 'HH:mm'));
  
  const filteredAvailableTimes = availableTimes.filter(time => !existingTimes.includes(time));
  
  // Handle rescheduling
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Combine date and time
      const newDateString = `${selectedDate}T${selectedTime}:00`;
      await onReschedule?.(booking.id, newDateString);
      onClose();
    } catch (err) {
      setError('Failed to reschedule booking');
      console.error('Reschedule error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Reschedule Booking</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium mb-2">Current Booking</h3>
          <div className="flex items-center mb-1">
            <Calendar size={16} className="mr-2 text-gray-600" />
            <span>{currentBookingDate}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-gray-600" />
            <span>{currentBookingTime}</span>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Client:</span> {booking.name || 'No name provided'}
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select New Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select New Time
            </label>
            {filteredAvailableTimes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {filteredAvailableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 border rounded-md text-center ${
                      selectedTime === time
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {format(parseISO(`2000-01-01T${time}`), 'h:mm a')}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                {selectedDate ? 'No available times for this date' : 'Select a date first'}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
              disabled={isLoading || !selectedDate || !selectedTime}
            >
              {isLoading ? 'Rescheduling...' : 'Reschedule Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleBookingModal; 