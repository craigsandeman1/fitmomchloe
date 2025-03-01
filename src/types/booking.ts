export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  date: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  email?: string;
  name?: string;
  notes?: string;
}

// New types for admin-controlled availability
export interface AvailableTimeSlot {
  id: string;
  day_of_week?: number; // 0 = Sunday, 1 = Monday, etc. (for recurring slots)
  specific_date?: string; // ISO date string (for one-time slots)
  start_time: string; // "HH:MM" format
  end_time: string; // "HH:MM" format
  is_available: boolean; // Can be used to block a normally available slot
  created_at: string;
  updated_at: string;
}

export interface TimeSlotGroup {
  id: string;
  name: string; // e.g., "Regular Hours", "Holiday Schedule"
  is_active: boolean;
  slots: AvailableTimeSlot[];
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday to Saturday

export interface WeekdayAvailability {
  [key: number]: string[]; // Key is day of week (0-6), value is array of time slots
}