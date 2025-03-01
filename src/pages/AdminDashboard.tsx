import { useState, useEffect } from 'react';
import { Plus, UserCircle, Calendar, LucideClipboardList, LogOut, Clock } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';

// Import admin components
import BookingsList from '../components/admin/BookingsList';
import MealPlanForm from '../components/admin/MealPlanForm';
import MealPlansList from '../components/admin/MealPlansList';
import VideoForm from '../components/admin/VideoForm';
import VideosList from '../components/admin/VideosList';
import UsersList from '../components/admin/UsersList';
import AdminTimeSlots from '../components/admin/AdminTimeSlots';

// Import types
import { Booking, BookingStatus } from '../types/booking';
import { MealPlan } from '../types/meal-plan';
import { Video as VideoType, VideoCategory } from '../types/video';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [videoCategories, setVideoCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [editingMealPlan, setEditingMealPlan] = useState<MealPlan | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const { user, signOut } = useUserStore();
  const { user: authUser } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!authUser) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          navigate('/');
          return;
        }

        if (!data?.is_admin) {
          navigate('/');
          return;
        }

        setIsAdmin(true);
        setIsCheckingAdmin(false);
        fetchData();
      } catch (err) {
        console.error('Error in admin check:', err);
        navigate('/');
      }
    };

    checkAdmin();
  }, [authUser, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Fetch meal plans
      const { data: mealPlansData, error: mealPlansError } = await supabase
        .from('meal_plans')
        .select('*')
        .order('title');

      if (mealPlansError) throw mealPlansError;
      setMealPlans(mealPlansData || []);

      // Fetch videos
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .order('title');

      if (videosError) throw videosError;
      setVideos(videosData || []);

      // Fetch video categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('video_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setVideoCategories(categoriesData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      ));
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Failed to update booking status.');
    }
  };

  const handleMealPlanSubmit = async (mealPlan: MealPlan) => {
    try {
      if (mealPlan.id) {
        // Update existing meal plan
        const { error } = await supabase
          .from('meal_plans')
          .update(mealPlan)
          .eq('id', mealPlan.id);

        if (error) throw error;

        setMealPlans(mealPlans.map(mp => 
          mp.id === mealPlan.id ? mealPlan : mp
        ));
      } else {
        // Create new meal plan
        const { data, error } = await supabase
          .from('meal_plans')
          .insert([{ ...mealPlan, id: undefined }])
          .select();

        if (error) throw error;
        if (data) {
          setMealPlans([...mealPlans, data[0]]);
        }
      }

      setEditingMealPlan(null);
    } catch (err) {
      console.error('Error saving meal plan:', err);
      setError('Failed to save meal plan.');
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMealPlans(mealPlans.filter(mp => mp.id !== id));
    } catch (err) {
      console.error('Error deleting meal plan:', err);
      setError('Failed to delete meal plan.');
    }
  };

  const handleVideoSubmit = async (video: VideoType) => {
    try {
      if (video.id) {
        // Update existing video
        const { error } = await supabase
          .from('videos')
          .update(video)
          .eq('id', video.id);

        if (error) throw error;

        setVideos(videos.map(v => 
          v.id === video.id ? video : v
        ));
      } else {
        // Create new video
        const { data, error } = await supabase
          .from('videos')
          .insert([{ ...video, id: undefined }])
          .select();

        if (error) throw error;
        if (data) {
          setVideos([...videos, data[0]]);
        }
      }

      setEditingVideo(null);
    } catch (err) {
      console.error('Error saving video:', err);
      setError('Failed to save video.');
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVideos(videos.filter(v => v.id !== id));
    } catch (err) {
      console.error('Error deleting video:', err);
      setError('Failed to delete video.');
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Checking administrator privileges...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>You do not have administrator privileges.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap">
              <button
                className={`${
                  activeTab === 'users'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('users')}
              >
                <UserCircle className="mr-2 h-5 w-5" />
                Users
              </button>
              <button
                className={`${
                  activeTab === 'mealPlans'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('mealPlans')}
              >
                <LucideClipboardList className="mr-2 h-5 w-5" />
                Meal Plans
              </button>
              <button
                className={`${
                  activeTab === 'bookings'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('bookings')}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Bookings
              </button>
              <button
                className={`${
                  activeTab === 'timeSlots'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('timeSlots')}
              >
                <Clock className="mr-2 h-5 w-5" />
                Time Slots
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && <UsersList />}
            {activeTab === 'mealPlans' && (
              <div>
                {!editingMealPlan ? (
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Meal Plans</h2>
                    <button
                      onClick={() => setEditingMealPlan({ 
                        id: null,
                        title: '', 
                        description: '', 
                        price: 0, 
                        content: { 
                          weeks: [] 
                        } 
                      } as any)}
                      className="btn-primary flex items-center"
                    >
                      <Plus size={16} className="mr-2" />
                      Add New Plan
                    </button>
                  </div>
                ) : null}
                
                {editingMealPlan ? (
                  <MealPlanForm
                    editingMealPlan={editingMealPlan}
                    onSubmit={handleMealPlanSubmit}
                    onCancel={() => setEditingMealPlan(null)}
                  />
                ) : (
                  <MealPlansList
                    mealPlans={mealPlans}
                    onEdit={setEditingMealPlan}
                    onDelete={deleteMealPlan}
                  />
                )}
              </div>
            )}
            {activeTab === 'bookings' && (
              <BookingsList
                bookings={bookings}
                updateBookingStatus={updateBookingStatus}
              />
            )}
            {activeTab === 'timeSlots' && <AdminTimeSlots />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;