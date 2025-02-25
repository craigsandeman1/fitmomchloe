import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Video, VideoCategory, VideoSubscription, VideoPurchase } from '../types/video';

interface VideoStore {
  videos: Video[];
  categories: VideoCategory[];
  userSubscription: VideoSubscription | null;
  userPurchases: VideoPurchase[];
  loading: boolean;
  error: string | null;
  fetchVideos: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchUserSubscription: () => Promise<void>;
  fetchUserPurchases: () => Promise<void>;
  createVideo: (video: Partial<Video>) => Promise<void>;
  updateVideo: (id: string, updates: Partial<Video>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  purchaseVideo: (videoId: string, price: number) => Promise<void>;
  subscribeToVideos: (planType: 'monthly' | 'yearly' | 'premium') => Promise<void>;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  categories: [],
  userSubscription: null,
  userPurchases: [],
  loading: false,
  error: null,

  fetchVideos: async () => {
    set({ loading: true, error: null });
    try {
      const { data: videos, error } = await supabase
        .from('videos')
        .select(`
          *,
          category:video_categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ videos: videos as Video[] });
    } catch (error) {
      console.error('Error fetching videos:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data: categories, error } = await supabase
        .from('video_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ categories: categories as VideoCategory[] });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: (error as Error).message });
    }
  },

  fetchUserSubscription: async () => {
    try {
      const { data, error } = await supabase
        .from('video_subscriptions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      // Set subscription to the first active subscription or null if none exists
      set({ userSubscription: data && data.length > 0 ? data[0] as VideoSubscription : null });
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      set({ userSubscription: null });
    }
  },

  fetchUserPurchases: async () => {
    try {
      const { data: purchases, error } = await supabase
        .from('video_purchases')
        .select('*')
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      set({ userPurchases: purchases as VideoPurchase[] });
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      set({ error: (error as Error).message });
    }
  },

  createVideo: async (video: Partial<Video>) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('videos')
        .insert([video]);

      if (error) throw error;
      await get().fetchVideos();
    } catch (error) {
      console.error('Error creating video:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateVideo: async (id: string, updates: Partial<Video>) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await get().fetchVideos();
    } catch (error) {
      console.error('Error updating video:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteVideo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  purchaseVideo: async (videoId: string, price: number) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('video_purchases')
        .insert([{
          video_id: videoId,
          amount_paid: price
        }]);

      if (error) throw error;
      await get().fetchUserPurchases();
    } catch (error) {
      console.error('Error purchasing video:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  subscribeToVideos: async (planType: 'monthly' | 'yearly' | 'premium') => {
    set({ loading: true, error: null });
    try {
      // Calculate end date based on plan type
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (planType === 'yearly' ? 12 : 1));

      const { error } = await supabase
        .from('video_subscriptions')
        .insert([{
          plan_type: planType,
          end_date: endDate.toISOString(),
          status: 'active'
        }]);

      if (error) throw error;
      await get().fetchUserSubscription();
    } catch (error) {
      console.error('Error subscribing to videos:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));