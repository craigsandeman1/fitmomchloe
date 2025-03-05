import { format, parseISO } from 'date-fns';
<<<<<<< Updated upstream
import { Calendar, Clock, Mail, User, Check, X, Trash2, Loader } from 'lucide-react';
import { useState } from 'react';
import { Booking } from '../../types/booking';
=======
import { Calendar, Clock, Mail, User, Check, X, List, Grid, RefreshCw } from 'lucide-react';
import { Booking, BookingStatus } from '../../types/booking';
import { useState } from 'react';
import BookingsCalendarView from './BookingsCalendarView';
import RescheduleBookingModal from './RescheduleBookingModal';
>>>>>>> Stashed changes

export interface BookingsListProps {
  bookings: Booking[];
<<<<<<< Updated upstream
  updateBookingStatus: (id: string, status: 'confirmed' | 'cancelled') => Promise<void>;
  deleteBooking?: (id: string) => Promise<void>;
}

const BookingsList = ({ bookings, updateBookingStatus, deleteBooking }: BookingsListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) {
      try {
        setDeletingId(id);
        await deleteBooking?.(id);
      } finally {
        setDeletingId(null);
      }
    }
=======
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  rescheduleBooking?: (id: string, newDate: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const BookingsList = ({ bookings, updateBookingStatus, rescheduleBooking }: BookingsListProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | null>(null);

  const handleRescheduleClick = (booking: Booking) => {
    setBookingToReschedule(booking);
>>>>>>> Stashed changes
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Bookings</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-md flex items-center ${viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            title="Calendar View"
          >
            <Grid size={20} className="mr-1" />
            <span className="text-sm">Calendar</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md flex items-center ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            title="List View"
          >
            <List size={20} className="mr-1" />
            <span className="text-sm">List</span>
          </button>
        </div>
      </div>
      
      {viewMode === 'calendar' ? (
        <BookingsCalendarView bookings={bookings} />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`p-4 rounded-lg border ${
                booking.status === 'cancelled'
                  ? 'bg-red-50'
                  : booking.status === 'confirmed'
                  ? 'bg-green-50'
                  : 'bg-yellow-50'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={16} />
                    <span>{format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={16} />
                    <span>{format(parseISO(booking.date), 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <User size={16} />
                    <span>{booking.name || 'No name provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} />
                    <span>{booking.email || 'No email provided'}</span>
                  </div>
                  
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleRescheduleClick(booking)}
                      className="mt-3 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center w-fit"
                    >
                      <RefreshCw size={14} className="mr-1" />
                      Reschedule
                    </button>
                  )}
                  {deleteBooking && (
                    <button
                      onClick={() => handleDelete(booking.id)}
                      disabled={deletingId === booking.id}
                      className={`inline-flex items-center px-3 py-1 ${
                        deletingId === booking.id 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gray-600 hover:bg-gray-700'
                      } text-white rounded-md`}
                      title="Permanently delete this booking"
                    >
                      {deletingId === booking.id ? (
                        <>
                          <Loader size={16} className="mr-1 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-end space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center"
                        >
                          <Check size={16} className="mr-2" />
                          Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </button>
                    )}
                    {booking.notes && (
                      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                        <h4 className="font-medium mb-1">Notes:</h4>
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {bookings.length === 0 && (
            <p className="text-center text-gray-500 py-4">No bookings found</p>
          )}
        </div>
      )}
      
      {/* Reschedule Modal */}
      {bookingToReschedule && (
        <RescheduleBookingModal
          booking={bookingToReschedule}
          onClose={() => setBookingToReschedule(null)}
          onReschedule={rescheduleBooking}
        />
      )}
    </div>
  );
};

export default BookingsList;