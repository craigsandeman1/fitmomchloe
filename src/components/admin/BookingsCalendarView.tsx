import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, addMonths, isSameDay, isAfter, isBefore } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Clock, RefreshCw } from 'lucide-react';
import { Booking, BookingStatus } from '../../types/booking';
import RescheduleBookingModal from './RescheduleBookingModal';

interface BookingsCalendarViewProps {
  bookings: Booking[];
  rescheduleBooking?: (id: string, newDate: string) => Promise<void>;
}

const BookingsCalendarView = ({ bookings, rescheduleBooking }: BookingsCalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | null>(null);

  // Filter to only show upcoming or recent bookings
  const relevantBookings = useMemo(() => {
    const now = new Date();
    // Show bookings from one month ago to 2 months in the future
    const oneMonthAgo = addMonths(now, -1);
    const twoMonthsFromNow = addMonths(now, 2);
    
    return bookings.filter(booking => {
      const bookingDate = parseISO(booking.date);
      return isAfter(bookingDate, oneMonthAgo) && isBefore(bookingDate, twoMonthsFromNow);
    });
  }, [bookings]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentMonth]);

  // Get day of week for the first day (0 = Sunday, 6 = Saturday)
  const startDay = getDay(calendarDays[0]);

  // Map bookings to the calendar days
  const bookingsByDay = useMemo(() => {
    const map = new Map<string, Booking[]>();
    
    relevantBookings.forEach(booking => {
      const dateKey = format(parseISO(booking.date), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(booking);
    });
    
    return map;
  }, [relevantBookings]);

  // Format a date key from a Date object
  const formatDateKey = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  // Get status color class
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'h:mm a');
  };

  const handleRescheduleClick = (booking: Booking) => {
    if (rescheduleBooking) {
      setBookingToReschedule(booking);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day names */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium py-2 text-gray-500">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="h-28 p-1 border rounded-md bg-gray-50"></div>
        ))}

        {/* Actual calendar days */}
        {calendarDays.map((day) => {
          const dateKey = formatDateKey(day);
          const dayBookings = bookingsByDay.get(dateKey) || [];
          const isCurrentDay = isToday(day);

          return (
            <div
              key={dateKey}
              className={`h-28 p-1 border rounded-md overflow-y-auto ${
                isCurrentDay ? 'bg-blue-50 border-blue-300' : 'bg-white'
              }`}
            >
              <div className="text-right mb-1">
                <span className={`text-sm inline-block rounded-full w-6 h-6 text-center leading-6 
                  ${isCurrentDay ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-1">
                {dayBookings.length > 0 ? (
                  dayBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={`text-xs p-1 rounded ${getStatusColor(booking.status)} relative group`}
                      title={`${booking.name} - ${formatTime(booking.date)} - ${booking.status}`}
                    >
                      <div className="flex items-center">
                        <Clock size={10} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{formatTime(booking.date)}</span>
                      </div>
                      <div className="truncate font-semibold">
                        {booking.name || 'Unnamed Client'}
                      </div>
                      
                      {rescheduleBooking && booking.status !== 'cancelled' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRescheduleClick(booking);
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-white text-blue-600 hover:bg-blue-100"
                          title="Reschedule"
                        >
                          <RefreshCw size={10} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 text-center">No bookings</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Reschedule Modal */}
      {bookingToReschedule && rescheduleBooking && (
        <RescheduleBookingModal
          booking={bookingToReschedule}
          onClose={() => setBookingToReschedule(null)}
          onReschedule={rescheduleBooking}
        />
      )}
    </>
  );
};

export default BookingsCalendarView; 