import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Booking, AvailableTimeSlot, WeekdayAvailability } from '../types/booking';

interface BookingStore {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  // Admin time slot management
  availableTimeSlots: AvailableTimeSlot[];
  defaultTimeSlots: string[];
  weekdayAvailability: WeekdayAvailability;
  slotsLoading: boolean;
  // Functions
  fetchUserBookings: () => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  createBooking: (booking: Partial<Booking>) => Promise<Booking | null>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  // Admin time slot functions
  fetchAvailableTimeSlots: () => Promise<void>;
  addTimeSlot: (slot: Partial<AvailableTimeSlot>) => Promise<void>;
  updateTimeSlot: (id: string, updates: Partial<AvailableTimeSlot>) => Promise<void>;
  deleteTimeSlot: (id: string) => Promise<void>;
  getAvailableTimesForDate: (date: string) => string[];
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  // Admin time slots data
  availableTimeSlots: [],
  defaultTimeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  weekdayAvailability: {},
  slotsLoading: false,

  fetchUserBookings: async () => {
    set({ loading: true, error: null });
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      set({ bookings: bookings as Booking[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchAllBookings: async () => {
    set({ loading: true, error: null });
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      set({ bookings: bookings as Booking[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createBooking: async (bookingData: Partial<Booking>) => {
    try {
      set({ error: null });
      
      // Get the user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to book a session');
      }
      
      // Create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          { 
            ...bookingData,
            user_id: user.id,
            status: 'pending'
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Fetch updated bookings
      get().fetchUserBookings();
      
      // Return the created booking
      return data?.[0] as Booking;
    } catch (err) {
      console.error('Error creating booking:', err);
      set({ error: err instanceof Error ? err.message : 'Failed to create booking' });
      return null;
    }
  },

  updateBooking: async (id: string, updates: Partial<Booking>) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await get().fetchUserBookings();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  cancelBooking: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
      await get().fetchUserBookings();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // Admin time slot functions
  fetchAvailableTimeSlots: async () => {
    set({ slotsLoading: true, error: null });
    try {
      // First check if the available_slots table exists
      const { data: tableExists, error: checkError } = await supabase
        .from('available_slots')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      // If we can't access the table or it doesn't exist yet,
      // just use the default slots
      if (checkError) {
        console.warn("Available slots table not found, using defaults:", checkError);
        
        // Generate weekday availability with defaults
        const weekdayDefaults: WeekdayAvailability = {};
        for (let i = 0; i < 7; i++) {
          // Skip Sunday (0) and Saturday (6) to make weekdays available by default
          if (i !== 0 && i !== 6) {
            weekdayDefaults[i] = get().defaultTimeSlots;
          } else {
            weekdayDefaults[i] = []; // No slots on weekends by default
          }
        }
        
        set({ 
          availableTimeSlots: [],
          weekdayAvailability: weekdayDefaults,
          slotsLoading: false 
        });
        return;
      }
      
      // If the table exists, fetch the slots
      const { data: slots, error } = await supabase
        .from('available_slots')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      
      // Process the available slots into the weekday availability structure
      const weekdaySlots: WeekdayAvailability = {};
      
      // Start with empty arrays for each day
      for (let i = 0; i < 7; i++) {
        weekdaySlots[i] = [];
      }
      
      // Add slots from database
      if (slots && slots.length > 0) {
        // Process recurring weekday slots
        slots.filter(slot => slot.day_of_week !== null && slot.is_available)
          .forEach(slot => {
            const day = slot.day_of_week as number;
            if (!weekdaySlots[day]) weekdaySlots[day] = [];
            weekdaySlots[day].push(slot.start_time);
          });
        
        set({ 
          availableTimeSlots: slots as AvailableTimeSlot[],
          weekdayAvailability: weekdaySlots,
        });
      } else {
        // If no slots defined yet, use defaults for weekdays
        const weekdayDefaults: WeekdayAvailability = {};
        for (let i = 0; i < 7; i++) {
          // Skip Sunday (0) and Saturday (6) to make weekdays available by default
          if (i !== 0 && i !== 6) {
            weekdayDefaults[i] = get().defaultTimeSlots;
          } else {
            weekdayDefaults[i] = []; // No slots on weekends by default
          }
        }
        
        set({ weekdayAvailability: weekdayDefaults });
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      set({ error: (error as Error).message });
      
      // Default to showing all slots if there's an error
      const weekdayDefaults: WeekdayAvailability = {};
      for (let i = 0; i < 7; i++) {
        weekdayDefaults[i] = get().defaultTimeSlots;
      }
      set({ weekdayAvailability: weekdayDefaults });
    } finally {
      set({ slotsLoading: false });
    }
  },

  addTimeSlot: async (slot: Partial<AvailableTimeSlot>) => {
    set({ slotsLoading: true, error: null });
    try {
      // Check if the table exists first
      const { error: tableError } = await supabase.rpc('check_table_exists', { 
        table_name: 'available_slots' 
      });
      
      // If the table doesn't exist, create it
      if (tableError) {
        console.log("Creating available_slots table");
        const createQuery = `
          CREATE TABLE IF NOT EXISTS available_slots (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            day_of_week SMALLINT,
            specific_date DATE,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            is_available BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `;
        
        await supabase.rpc('run_sql', { query: createQuery });
      }
      
      const { error } = await supabase
        .from('available_slots')
        .insert([slot]);

      if (error) throw error;
      await get().fetchAvailableTimeSlots();
    } catch (error) {
      console.error("Error adding time slot:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ slotsLoading: false });
    }
  },

  updateTimeSlot: async (id: string, updates: Partial<AvailableTimeSlot>) => {
    set({ slotsLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('available_slots')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await get().fetchAvailableTimeSlots();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ slotsLoading: false });
    }
  },

  deleteTimeSlot: async (id: string) => {
    set({ slotsLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchAvailableTimeSlots();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ slotsLoading: false });
    }
  },

  getAvailableTimesForDate: (date: string) => {
    // If no date provided, return empty array
    if (!date) return [];
    
    try {
      const jsDate = new Date(date);
      const dayOfWeek = jsDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Get the available time slots for this day of the week
      const { weekdayAvailability, availableTimeSlots } = get();
      
      // Default to the weekday pattern
      let availableTimes = weekdayAvailability[dayOfWeek] || [];
      
      // Check for any specific date overrides
      const dateString = date.split('T')[0]; // Get just the date part
      const specificDateSlots = availableTimeSlots
        .filter(slot => 
          slot.specific_date === dateString && 
          slot.is_available
        )
        .map(slot => slot.start_time);
      
      // If there are specific slots for this date, use those instead
      if (specificDateSlots.length > 0) {
        availableTimes = specificDateSlots;
      }
      
      // Check for any blocked slots on this specific date
      const blockedSlots = availableTimeSlots
        .filter(slot => 
          slot.specific_date === dateString && 
          !slot.is_available
        )
        .map(slot => slot.start_time);
      
      // Remove any blocked slots
      availableTimes = availableTimes.filter(time => !blockedSlots.includes(time));
      
      return availableTimes;
    } catch (error) {
      console.error("Error calculating available times:", error);
      return get().defaultTimeSlots; // Fallback to defaults
    }
  }
}));