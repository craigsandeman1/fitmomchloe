import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Mail, User, Check, X } from 'lucide-react';
import { Booking } from '../../types/booking';

interface BookingsListProps {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: 'confirmed' | 'cancelled') => Promise<void>;
}

const BookingsList = ({ bookings, updateBookingStatus }: BookingsListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">All Bookings</h2>
      
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
                  <span>{format(parseISO(booking.date), 'HH:mm')}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <User size={16} />
                  <span>{booking.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <a href={`mailto:${booking.email}`} className="text-primary hover:underline">
                    {booking.email}
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end justify-between">
                <div className="space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        <Check size={16} className="mr-1" />
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        <X size={16} className="mr-1" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {booking.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {booking.notes}
                </p>
              </div>
            )}
          </div>
        ))}

        {bookings.length === 0 && (
          <p className="text-center text-gray-500">No bookings found</p>
        )}
      </div>
    </div>
  );
};

export default BookingsList;