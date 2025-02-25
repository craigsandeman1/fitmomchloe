import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Booking } from '../types/booking';

interface BookingStore {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchUserBookings: () => Promise<void>;
  createBooking: (booking: Partial<Booking>) => Promise<void>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,

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

  createBooking: async (booking: Partial<Booking>) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([booking]);

      if (error) throw error;
      await get().fetchUserBookings();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
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
}));