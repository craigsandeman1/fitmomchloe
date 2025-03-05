<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Calendar, Save, X, AlertCircle, CheckCircle, Grid } from 'lucide-react';
=======
import { useState, useEffect, useCallback, memo } from 'react';
import { Clock, Plus, Trash2, Calendar, Save, X, AlertCircle, CheckCircle, Eye } from 'lucide-react';
>>>>>>> Stashed changes
import { useBookingStore } from '../../store/booking';
import { AvailableTimeSlot, DayOfWeek } from '../../types/booking';
import TimeSlotCalendarView from './TimeSlotCalendarView';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface AdminTimeSlotsProps {
  onClose?: () => void;
}

const AdminTimeSlots = ({ onClose }: AdminTimeSlotsProps) => {
  const { 
    availableTimeSlots, 
    defaultTimeSlots,
    fetchAvailableTimeSlots, 
    addTimeSlot, 
    updateTimeSlot, 
    deleteTimeSlot,
    slotsLoading,
    error
  } = useBookingStore();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(1); // Default to Monday
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [specificDate, setSpecificDate] = useState<string>('');
  const [isForSpecificDate, setIsForSpecificDate] = useState<boolean>(false);
  const [status, setStatus] = useState<{success: boolean; message: string} | null>(null);
<<<<<<< Updated upstream
  const [viewMode, setViewMode] = useState<'single' | 'weekly'>('single');
=======
  const [viewMode, setViewMode] = useState<'detailed' | 'overview'>('detailed');

  // Memoize fetchAvailableTimeSlots to prevent unnecessary re-renders
  const fetchTimeSlotsOnce = useCallback(async () => {
    if (slotsLoading || availableTimeSlots.length > 0) return;
    await fetchAvailableTimeSlots();
  }, [fetchAvailableTimeSlots, slotsLoading, availableTimeSlots.length]);
>>>>>>> Stashed changes

  useEffect(() => {
    fetchTimeSlotsOnce();
  }, [fetchTimeSlotsOnce]);

  const handleAddTimeSlot = async () => {
    try {
      setStatus(null);
      
      // Validate the input
      if (startTime >= endTime) {
        setStatus({
          success: false,
          message: 'Start time must be before end time'
        });
        return;
      }

      const newSlot: Partial<AvailableTimeSlot> = {
        start_time: startTime,
        end_time: endTime,
        is_available: isAvailable,
      };

      // Set either day_of_week or specific_date, not both
      if (isForSpecificDate && specificDate) {
        newSlot.specific_date = specificDate;
      } else {
        newSlot.day_of_week = selectedDay;
      }

      await addTimeSlot(newSlot);
      
      // Reset the form
      setStartTime('09:00');
      setEndTime('10:00');
      setIsAvailable(true);
      setSpecificDate('');
      setIsForSpecificDate(false);
      
      setStatus({
        success: true,
        message: `Time slot ${isAvailable ? 'added' : 'blocked'} successfully`
      });
    } catch (err) {
      setStatus({
        success: false,
        message: `Error: ${err instanceof Error ? err.message : 'Something went wrong'}`
      });
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      await deleteTimeSlot(id);
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    await updateTimeSlot(id, { is_available: !currentStatus });
  };

  // Filter slots by selected day or specific date
  const filteredSlots = availableTimeSlots.filter(slot => {
    if (isForSpecificDate && specificDate) {
      return slot.specific_date === specificDate;
    }
    return slot.day_of_week === selectedDay;
  });

  // Get slots for each day of the week for the weekly view
  const getSlotsByDay = () => {
    const slotsByDay: { [key: string]: AvailableTimeSlot[] } = {};
    
    // Initialize with empty arrays for each day
    DAY_NAMES.forEach((day, index) => {
      slotsByDay[index] = [];
    });
    
    // Populate with slots
    availableTimeSlots.forEach(slot => {
      if (slot.day_of_week !== null && slot.day_of_week !== undefined) {
        slotsByDay[slot.day_of_week].push(slot);
      }
    });
    
    return slotsByDay;
  };

  const weeklySlots = getSlotsByDay();

  // Generate time slots for bulk add (15 min intervals from 6am to 10pm)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();

  // Function to apply default slots to selected day
  const applyDefaultSlots = async () => {
    try {
      setStatus(null);
      
      // Create a slot for each default time
      for (const time of defaultTimeSlots) {
        // Calculate end time (1 hour after start)
        const [hour, minute] = time.split(':').map(Number);
        const endHour = (hour + 1) % 24;
        const formattedEndHour = endHour.toString().padStart(2, '0');
        const formattedEndMinute = minute.toString().padStart(2, '0');
        const calculatedEndTime = `${formattedEndHour}:${formattedEndMinute}`;
        
        const newSlot: Partial<AvailableTimeSlot> = {
          start_time: time,
          end_time: calculatedEndTime,
          is_available: true,
          day_of_week: selectedDay
        };
        
        await addTimeSlot(newSlot);
      }
      
      setStatus({
        success: true,
        message: `Default time slots applied to ${DAY_NAMES[selectedDay]}`
      });
    } catch (err) {
      setStatus({
        success: false,
        message: `Error: ${err instanceof Error ? err.message : 'Something went wrong'}`
      });
    }
  };

  // Apply default slots to all weekdays (Monday-Friday)
  const applyDefaultSlotsToAllWeekdays = async () => {
    try {
      setStatus(null);
      
      // Define weekdays (Monday = 1 to Friday = 5)
      const weekdays = [1, 2, 3, 4, 5];
      
      for (const day of weekdays) {
        // Create a slot for each default time
        for (const time of defaultTimeSlots) {
          // Calculate end time (1 hour after start)
          const [hour, minute] = time.split(':').map(Number);
          const endHour = (hour + 1) % 24;
          const formattedEndHour = endHour.toString().padStart(2, '0');
          const formattedEndMinute = minute.toString().padStart(2, '0');
          const calculatedEndTime = `${formattedEndHour}:${formattedEndMinute}`;
          
          const newSlot: Partial<AvailableTimeSlot> = {
            start_time: time,
            end_time: calculatedEndTime,
            is_available: true,
            day_of_week: day
          };
          
          await addTimeSlot(newSlot);
        }
      }
      
      setStatus({
        success: true,
        message: `Default time slots applied to all weekdays (Monday-Friday)`
      });
    } catch (err) {
      setStatus({
        success: false,
        message: `Error: ${err instanceof Error ? err.message : 'Something went wrong'}`
      });
    }
  };

  // Function to render the slot table
  const renderSlotTable = (slots: AvailableTimeSlot[]) => {
    if (slots.length === 0) {
      return (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No time slots defined</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td className="px-2 py-2 whitespace-nowrap">
                  <div className="text-xs text-gray-900">{slot.start_time}</div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <div className="text-xs text-gray-900">{slot.end_time}</div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <span 
                    className={`px-1 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${
                      slot.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {slot.is_available ? 'Available' : 'Blocked'}
                  </span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-right text-xs font-medium">
                  <button
                    onClick={() => handleToggleAvailability(slot.id, slot.is_available)}
                    className={`mr-1 ${
                      slot.is_available 
                        ? 'text-red-600 hover:text-red-900' 
                        : 'text-green-600 hover:text-green-900'
                    }`}
                    title={slot.is_available ? 'Block this slot' : 'Make available'}
                  >
                    {slot.is_available ? 'Block' : 'Unblock'}
                  </button>
                  <button
                    onClick={() => handleDeleteTimeSlot(slot.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete slot"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Format a date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <Clock size={24} className="mr-2 text-primary" />
          Manage Available Time Slots
        </h2>
        <div className="flex items-center">
          <button
            onClick={() => setViewMode(viewMode === 'detailed' ? 'overview' : 'detailed')}
            className="p-2 mr-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
            title={viewMode === 'detailed' ? 'Switch to overview' : 'Switch to detailed view'}
          >
            <Eye size={18} className="mr-1" />
            {viewMode === 'detailed' ? 'Overview' : 'Detailed'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => setViewMode('single')}
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
              viewMode === 'single'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Single Day View
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg ${
              viewMode === 'weekly'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Grid size={16} className="inline mr-1" />
            Weekly Overview
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {status && (
        <div className={`mb-6 p-4 rounded-md ${status.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center`}>
          {status.success ? (
            <CheckCircle className="mr-2" size={20} />
          ) : (
            <AlertCircle className="mr-2" size={20} />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {viewMode === 'overview' ? (
        <TimeSlotCalendarView />
      ) : (
        <>
          {/* Add New Time Slot Form */}
          <div className="mb-8 p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Add New Time Slot</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="radio"
                    checked={!isForSpecificDate}
                    onChange={() => setIsForSpecificDate(false)}
                    className="mr-2"
                  />
                  <span>Recurring Weekly Slot</span>
                </label>
                
                {!isForSpecificDate && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day of Week
                    </label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(Number(e.target.value) as DayOfWeek)}
                      className="w-full p-2 border rounded-md"
                    >
                      {DAY_NAMES.map((day, index) => (
                        <option key={day} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="radio"
                    checked={isForSpecificDate}
                    onChange={() => setIsForSpecificDate(true)}
                    className="mr-2"
                  />
                  <span>Specific Date Slot</span>
                </label>
                
                {isForSpecificDate && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={specificDate}
                      onChange={(e) => setSpecificDate(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required={isForSpecificDate}
                      min={new Date().toISOString().split('T')[0]} // Today's date as minimum
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {timeOptions.map(time => (
                    <option key={`start-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {timeOptions.map(time => (
                    <option key={`end-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={isAvailable ? 'available' : 'blocked'}
                  onChange={(e) => setIsAvailable(e.target.value === 'available')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="available">Available for Booking</option>
                  <option value="blocked">Blocked (Unavailable)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              {!isForSpecificDate && (
                <button
                  type="button"
                  onClick={applyDefaultSlots}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Calendar size={16} className="mr-2" />
                  Apply Default Slots
                </button>
              )}
              <button
                type="button"
                onClick={handleAddTimeSlot}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Time Slot
              </button>
            </div>
          </div>

          {/* Existing Time Slots */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isForSpecificDate && specificDate
                  ? `Time Slots for ${formatDate(specificDate)}`
                  : `Time Slots for ${DAY_NAMES[selectedDay]}`}
              </h3>
              
              <div className="flex space-x-2">
                <select
                  value={selectedDay}
                  onChange={(e) => {
                    setSelectedDay(Number(e.target.value) as DayOfWeek);
                    setIsForSpecificDate(false);
                  }}
                  className="p-2 border rounded-md"
                  disabled={isForSpecificDate}
                >
                  {DAY_NAMES.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => fetchTimeSlotsOnce()}
                  className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                  title="Refresh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2v6h-6"></path>
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                    <path d="M3 22v-6h6"></path>
                    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                  </svg>
                </button>
              </div>
            </div>

            {slotsLoading ? (
              <div className="text-center py-12">
                <p>Loading time slots...</p>
              </div>
            ) : filteredSlots.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No time slots defined for this {isForSpecificDate ? 'date' : 'day'}</p>
                {!isForSpecificDate && (
                  <button
                    onClick={applyDefaultSlots}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                  >
                    <Plus size={16} className="mr-2" />
                    Apply Default Slots
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSlots.map((slot) => (
                      <tr key={slot.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{slot.start_time}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{slot.end_time}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              slot.is_available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {slot.is_available ? 'Available' : 'Blocked'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleToggleAvailability(slot.id, slot.is_available)}
                            className={`mr-3 ${
                              slot.is_available 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={slot.is_available ? 'Block this slot' : 'Make available'}
                          >
                            {slot.is_available ? 'Block' : 'Unblock'}
                          </button>
                          <button
                            onClick={() => handleDeleteTimeSlot(slot.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete slot"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
<<<<<<< Updated upstream
          
          <div>
            <label className="flex items-center mb-4">
              <input
                type="radio"
                checked={isForSpecificDate}
                onChange={() => setIsForSpecificDate(true)}
                className="mr-2"
              />
              <span>Specific Date Slot</span>
            </label>
            
            {isForSpecificDate && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required={isForSpecificDate}
                  min={new Date().toISOString().split('T')[0]} // Today's date as minimum
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {timeOptions.map(time => (
                <option key={`start-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {timeOptions.map(time => (
                <option key={`end-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <select
              value={isAvailable ? 'available' : 'blocked'}
              onChange={(e) => setIsAvailable(e.target.value === 'available')}
              className="w-full p-2 border rounded-md"
            >
              <option value="available">Available for Booking</option>
              <option value="blocked">Blocked (Unavailable)</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          {!isForSpecificDate && (
            <>
              <button
                type="button"
                onClick={applyDefaultSlots}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Calendar size={16} className="mr-2" />
                Apply Default Slots
              </button>
              <button
                type="button"
                onClick={applyDefaultSlotsToAllWeekdays}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Calendar size={16} className="mr-2" />
                Apply to All Weekdays
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleAddTimeSlot}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Time Slot
          </button>
        </div>
      </div>

      {/* Existing Time Slots - Choose view based on viewMode */}
      {viewMode === 'single' ? (
        // Single day view (original view)
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {isForSpecificDate && specificDate
                ? `Time Slots for ${formatDate(specificDate)}`
                : `Time Slots for ${DAY_NAMES[selectedDay]}`}
            </h3>
            
            <div className="flex space-x-2">
              <select
                value={selectedDay}
                onChange={(e) => {
                  setSelectedDay(Number(e.target.value) as DayOfWeek);
                  setIsForSpecificDate(false);
                }}
                className="p-2 border rounded-md"
                disabled={isForSpecificDate}
              >
                {DAY_NAMES.map((day, index) => (
                  <option key={day} value={index}>
                    {day}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => fetchAvailableTimeSlots()}
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                title="Refresh"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6"></path>
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                  <path d="M3 22v-6h6"></path>
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                </svg>
              </button>
            </div>
          </div>

          {slotsLoading ? (
            <div className="text-center py-12">
              <p>Loading time slots...</p>
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No time slots defined for this {isForSpecificDate ? 'date' : 'day'}</p>
              {!isForSpecificDate && (
                <button
                  onClick={applyDefaultSlots}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Apply Default Slots
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSlots.map((slot) => (
                    <tr key={slot.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{slot.start_time}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{slot.end_time}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            slot.is_available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {slot.is_available ? 'Available' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleToggleAvailability(slot.id, slot.is_available)}
                          className={`mr-3 ${
                            slot.is_available 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={slot.is_available ? 'Block this slot' : 'Make available'}
                        >
                          {slot.is_available ? 'Block' : 'Unblock'}
                        </button>
                        <button
                          onClick={() => handleDeleteTimeSlot(slot.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete slot"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // Weekly overview
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Weekly Time Slots Overview
            </h3>
            
            <button
              onClick={() => fetchAvailableTimeSlots()}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
            </button>
          </div>

          {slotsLoading ? (
            <div className="text-center py-12">
              <p>Loading time slots...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {DAY_NAMES.map((day, index) => (
                <div key={day} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-medium border-b">
                    {day}
                  </div>
                  <div className="p-3">
                    {renderSlotTable(weeklySlots[index])}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
=======
        </>
>>>>>>> Stashed changes
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(AdminTimeSlots); 