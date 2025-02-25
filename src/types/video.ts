export interface VideoCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  video_url: string;
  duration: string | null;
  difficulty_level: string | null;
  category_id: string | null;
  individual_price: number | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  category?: VideoCategory;
}

export interface VideoSubscription {
  id: string;
  user_id: string;
  plan_type: 'monthly' | 'yearly' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface VideoPurchase {
  id: string;
  user_id: string;
  video_id: string;
  purchase_date: string;
  amount_paid: number;
}