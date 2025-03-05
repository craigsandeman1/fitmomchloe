import { useState, useEffect, useCallback, memo } from 'react';
import { useBookingStore } from '../../store/booking';
import { AvailableTimeSlot } from '../../types/booking';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimeSlotCalendarView = () => {
  const { availableTimeSlots, fetchAvailableTimeSlots } = useBookingStore();
  const [isLoading, setIsLoading] = useState(true);
  const [weeklySlots, setWeeklySlots] = useState<{[key: number]: AvailableTimeSlot[]}>({});
  const [specialDates, setSpecialDates] = useState<{[key: string]: AvailableTimeSlot[]}>({});

  // Memoize the loadTimeSlots function to prevent recreating it on re-renders
  const loadTimeSlots = useCallback(async () => {
    if (!isLoading) return; // Only load if we haven't loaded yet
    
    setIsLoading(true);
    await fetchAvailableTimeSlots();
    setIsLoading(false);
  }, [fetchAvailableTimeSlots, isLoading]);

  useEffect(() => {
    loadTimeSlots();
  }, [loadTimeSlots]);

  // Memoize the slot organization logic
  useEffect(() => {
    if (availableTimeSlots.length === 0) return;
    
    // Organize slots by day of week and specific dates
    const weekly: {[key: number]: AvailableTimeSlot[]} = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };
    const special: {[key: string]: AvailableTimeSlot[]} = {};

    availableTimeSlots.forEach(slot => {
      if (slot.day_of_week !== undefined) {
        weekly[slot.day_of_week].push(slot);
      } else if (slot.specific_date) {
        if (!special[slot.specific_date]) {
          special[slot.specific_date] = [];
        }
        special[slot.specific_date].push(slot);
      }
    });

    // Sort slots by start time
    Object.keys(weekly).forEach(day => {
      weekly[Number(day)].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
    
    Object.keys(special).forEach(date => {
      special[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    setWeeklySlots(weekly);
    setSpecialDates(special);
  }, [availableTimeSlots]);

  // Format time for display
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading timeslots...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Timeslots Overview</h2>
      
      {/* Weekly Overview */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Weekly Schedule</h3>
        <div className="grid grid-cols-7 gap-2">
          {DAY_NAMES.map((day, index) => (
            <div key={day} className="border rounded-md overflow-hidden">
              <div className="bg-gray-100 p-2 font-semibold text-center border-b">
                {day}
              </div>
              <div className="p-2 h-36 overflow-y-auto">
                {weeklySlots[index].length === 0 ? (
                  <p className="text-sm text-gray-500 text-center p-2">No slots</p>
                ) : (
                  <div className="space-y-1">
                    {weeklySlots[index].map((slot, i) => (
                      <div 
                        key={i} 
                        className={`text-xs p-1 rounded ${
                          slot.is_available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Special Dates */}
      {Object.keys(specialDates).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Special Dates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(specialDates)
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
              .map(date => (
                <div key={date} className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 p-2 font-semibold text-center border-b">
                    {formatDate(date)}
                  </div>
                  <div className="p-3">
                    {specialDates[date].map((slot, i) => (
                      <div 
                        key={i} 
                        className={`text-sm p-1 mb-1 rounded ${
                          slot.is_available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </div>
                    ))}
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(TimeSlotCalendarView); 