export interface Booking {
  id: string;
  user_id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  email?: string;
  name?: string;
  notes?: string;
}