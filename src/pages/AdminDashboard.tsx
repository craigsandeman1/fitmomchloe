import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';
import { Booking } from '../types/booking';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../components/Auth';
import { MealPlan } from '../types/meal-plan';
import { Video as VideoType, VideoCategory } from '../types/video';

// Import admin components
import BookingsList from '../components/admin/BookingsList';
import MealPlanForm from '../components/admin/MealPlanForm';
import MealPlansList from '../components/admin/MealPlansList';
import VideoForm from '../components/admin/VideoForm';
import VideosList from '../components/admin/VideosList';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'bookings' | 'meal-plans' | 'videos'>('bookings');
  const [editingMealPlan, setEditingMealPlan] = useState<MealPlan | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [videoCategories, setVideoCategories] = useState<VideoCategory[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', user.id);

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setIsCheckingAdmin(false);
          return;
        }

        const isUserAdmin = Array.isArray(data) && data.length > 0;
        setIsAdmin(isUserAdmin);

        if (isUserAdmin) {
          fetchAllBookings();
          fetchMealPlans();
          fetchVideos();
          fetchVideoCategories();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const fetchAllBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          category:video_categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchVideoCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('video_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setVideoCategories(data || []);
    } catch (error) {
      console.error('Error fetching video categories:', error);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const videoData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      video_url: formData.get('video_url') as string,
      thumbnail_url: formData.get('thumbnail_url') as string || null,
      duration: formData.get('duration') as string || null,
      difficulty_level: formData.get('difficulty_level') as string || null,
      category_id: formData.get('category_id') as string || null,
      individual_price: formData.get('individual_price') ? parseFloat(formData.get('individual_price') as string) : null,
      is_premium: formData.get('is_premium') === 'true'
    };

    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', editingVideo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([videoData]);

        if (error) throw error;
      }

      fetchVideos();
      setEditingVideo(null);
      form.reset();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleMealPlanSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const mealPlanData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      dietary_type: formData.get('dietary_type') as string || undefined,
      difficulty_level: formData.get('difficulty_level') as string || undefined,
      preparation_time: formData.get('preparation_time') as string || undefined,
      duration_weeks: formData.get('duration_weeks') ? parseInt(formData.get('duration_weeks') as string) : undefined,
      total_calories: formData.get('total_calories') ? parseInt(formData.get('total_calories') as string) : undefined,
      total_protein: formData.get('total_protein') ? parseInt(formData.get('total_protein') as string) : undefined,
      total_carbs: formData.get('total_carbs') ? parseInt(formData.get('total_carbs') as string) : undefined,
      total_fat: formData.get('total_fat') ? parseInt(formData.get('total_fat') as string) : undefined,
      includes_grocery_list: formData.get('includes_grocery_list') === 'true',
      includes_recipes: formData.get('includes_recipes') === 'true',
      content: {
        weeks: [
          {
            weekNumber: 1,
            days: [
              {
                day: "Sample Day",
                meals: [
                  {
                    type: "breakfast",
                    name: "Sample Breakfast",
                    ingredients: ["Ingredient 1", "Ingredient 2"],
                    instructions: ["Step 1", "Step 2"],
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    try {
      if (editingMealPlan) {
        const { error } = await supabase
          .from('meal_plans')
          .update(mealPlanData)
          .eq('id', editingMealPlan.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('meal_plans')
          .insert([mealPlanData]);

        if (error) throw error;
      }

      fetchMealPlans();
      setEditingMealPlan(null);
      form.reset();
    } catch (error) {
      console.error('Error saving meal plan:', error);
    }
  };

  const deleteMealPlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meal plan?')) return;

    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMealPlans();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      fetchAllBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="section-container py-20">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="section-container py-20">
        <h1 className="font-playfair text-4xl mb-8 text-center">Admin Login</h1>
        <div className="max-w-md mx-auto">
          <Auth />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="section-container py-20">
        <h1 className="font-playfair text-4xl mb-8 text-center">Access Denied</h1>
        <p className="text-center text-gray-600">
          You do not have permission to access this area.
        </p>
      </div>
    );
  }

  return (
    <div className="section-container py-20">
      <h1 className="font-playfair text-4xl mb-8">Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('meal-plans')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'meal-plans'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meal Plans
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'videos'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Videos
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookings' && (
        <BookingsList
          bookings={bookings}
          updateBookingStatus={updateBookingStatus}
        />
      )}

      {activeTab === 'meal-plans' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Meal Plans</h2>
            {!editingMealPlan && (
              <button
                onClick={() => setEditingMealPlan({ id: '', title: '', description: '', price: 0, content: { weeks: [] } } as MealPlan)}
                className="btn-primary flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add New Plan
              </button>
            )}
          </div>

          {editingMealPlan && (
            <MealPlanForm
              editingMealPlan={editingMealPlan}
              onSubmit={handleMealPlanSubmit}
              onCancel={() => setEditingMealPlan(null)}
            />
          )}
          {!editingMealPlan && (
            <MealPlansList
              mealPlans={mealPlans}
              onEdit={setEditingMealPlan}
              onDelete={deleteMealPlan}
            />
          )}
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Videos</h2>
            {!editingVideo && (
              <button
                onClick={() => setEditingVideo({ id: '', title: '', description: '', video_url: '' } as VideoType)}
                className="btn-primary flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add New Video
              </button>
            )}
          </div>

          {editingVideo && (
            <VideoForm
              editingVideo={editingVideo}
              videoCategories={videoCategories}
              onSubmit={handleVideoSubmit}
              onCancel={() => setEditingVideo(null)}
            />
          )}
          {!editingVideo && (
            <VideosList
              videos={videos}
              onEdit={setEditingVideo}
              onDelete={deleteVideo}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;