import { useState, useEffect, useRef } from 'react';
<<<<<<< Updated upstream
import { Plus, UserCircle, Calendar, LucideClipboardList, LogOut, Clock, Film } from 'lucide-react';
=======
import { Plus, UserCircle, Calendar, LucideClipboardList, LogOut, Clock } from 'lucide-react';
>>>>>>> Stashed changes
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';
<<<<<<< Updated upstream
import { verifyAdminStatus, debugAdminStatus } from '../lib/adminUtils';
import { useBookingStore } from '../store/booking';
=======
import { v4 as uuidv4 } from 'uuid';
import { sendBookingCancellationNotification, sendBookingRescheduleNotification } from '../lib/notifications';
>>>>>>> Stashed changes

// Import admin components
import BookingsList from '../components/admin/BookingsList';
import MealPlanForm from '../components/admin/MealPlanForm';
import MealPlansList from '../components/admin/MealPlansList';
import VideoForm from '../components/admin/VideoForm';
import VideosList from '../components/admin/VideosList';
import UsersList from '../components/admin/UsersList';
import AdminTimeSlots from '../components/admin/AdminTimeSlots';
<<<<<<< Updated upstream
import AdminDebug from '../components/AdminDebug';
=======
import BookingsCalendarView from '../components/admin/BookingsCalendarView';
>>>>>>> Stashed changes

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
  const [activeTab, setActiveTab] = useState('timeSlots');
  const [editingMealPlan, setEditingMealPlan] = useState<MealPlan | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const { user } = useUserStore();
  const { user: authUser } = useAuthStore();
<<<<<<< Updated upstream
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const adminCheckInProgress = useRef(false);
  const navigate = useNavigate();
  const { deleteBooking } = useBookingStore();
=======
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
>>>>>>> Stashed changes

  // Load data on component mount
  useEffect(() => {
<<<<<<< Updated upstream
    const checkAdmin = async () => {
      // Prevent multiple simultaneous admin checks
      if (adminCheckInProgress.current) return;
      
      try {
        // Set the flag to indicate admin check is in progress
        adminCheckInProgress.current = true;
        
        // Skip check if we've already verified the user is an admin
        if (isAdmin) {
          setIsCheckingAdmin(false);
          adminCheckInProgress.current = false;
          return;
        }
        
        if (!authUser) {
          navigate('/login', { state: { from: '/admin' } });
          adminCheckInProgress.current = false;
          return;
        }

        const adminStatus = await verifyAdminStatus();
        
        // Log admin status for debugging
        console.log('Admin status check result:', adminStatus);
        
        if (!adminStatus.isAuthenticated) {
          navigate('/login', { state: { from: '/admin' } });
          adminCheckInProgress.current = false;
          return;
        }
        
        if (!adminStatus.profilesIsAdmin) {
          // Extra debugging to help troubleshoot admin access issues
          if (adminStatus.inAdminUsersTable) {
            console.warn('User is in admin_users table but profiles.is_admin is false. Inconsistent admin status detected.');
          }
          
          console.error('Access denied: User is not an admin.');
          navigate('/');
          adminCheckInProgress.current = false;
          return;
        }
        
        setIsAdmin(true);
        setIsCheckingAdmin(false);
        fetchData();
      } catch (err) {
        console.error('Error in admin check:', err);
        navigate('/');
      } finally {
        // Always reset the flag when done
        adminCheckInProgress.current = false;
      }
    };

    checkAdmin();
  }, [authUser, navigate, isAdmin]);
=======
    fetchData();
  }, []);
>>>>>>> Stashed changes

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
      // Get the booking before updating to use for notification
      const bookingToUpdate = bookings.find(b => b.id === id);
      if (!bookingToUpdate) {
        throw new Error('Booking not found');
      }

      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      ));

      // Send notification if booking is cancelled
      if (status === 'cancelled' && bookingToUpdate.email) {
        await sendBookingCancellationNotification({
          ...bookingToUpdate,
          status // Update with new status
        });
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Failed to update booking status.');
    }
  };

  const rescheduleBooking = async (id: string, newDate: string) => {
    try {
      // Get the booking before updating to use for notification
      const bookingToUpdate = bookings.find(b => b.id === id);
      if (!bookingToUpdate) {
        throw new Error('Booking not found');
      }

      const oldDate = bookingToUpdate.date;
      
      // Update the booking in the database
      const { error } = await supabase
        .from('bookings')
        .update({ 
          date: newDate,
          status: 'confirmed', // Automatically confirm rescheduled bookings
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id 
          ? { ...booking, date: newDate, status: 'confirmed', updated_at: new Date().toISOString() } 
          : booking
      ));

      // Send notification about the rescheduled booking
      if (bookingToUpdate.email) {
        await sendBookingRescheduleNotification(
          {
            ...bookingToUpdate,
            date: newDate,
            status: 'confirmed'
          }, 
          oldDate
        );
      }
      
    } catch (err) {
      console.error('Error rescheduling booking:', err);
      setError('Failed to reschedule booking.');
      throw err; // Re-throw to handle in the UI
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
        // Create new meal plan with a generated UUID
        const newMealPlan = {
          ...mealPlan,
          id: uuidv4() // Generate a new UUID for the meal plan
        };
        
        const { data, error } = await supabase
          .from('meal_plans')
          .insert([newMealPlan])
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
          .update({
            title: video.title,
            description: video.description,
            video_url: video.video_url,
            thumbnail_url: video.thumbnail_url,
            duration: video.duration,
            difficulty_level: video.difficulty_level,
            category_id: video.category_id,
            individual_price: video.individual_price,
            is_premium: video.is_premium
          })
          .eq('id', video.id);

        if (error) throw error;

        setVideos(videos.map(v => 
          v.id === video.id ? { ...v, ...video } : v
        ));
      } else {
        // Create new video
        const { data, error } = await supabase
          .from('videos')
          .insert([{
            title: video.title,
            description: video.description,
            video_url: video.video_url,
            thumbnail_url: video.thumbnail_url,
            duration: video.duration,
            difficulty_level: video.difficulty_level,
            category_id: video.category_id,
            individual_price: video.individual_price,
            is_premium: video.is_premium
          }])
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

  const handleSignOut = async () => {
    try {
      const { signOut } = useAuthStore.getState();
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

<<<<<<< Updated upstream
  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking(id);
      // Update local state to remove the deleted booking
      setBookings(bookings.filter(booking => booking.id !== id));
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking.');
    }
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

=======
>>>>>>> Stashed changes
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

        {/* Debug component for development - remove in production */}
        {process.env.NODE_ENV !== 'production' && <AdminDebug />}

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
                  activeTab === 'videos'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('videos')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                Videos
              </button>
              <button
                className={`${
                  activeTab === 'bookings'
                    ? 'border-primary text-primary bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('bookings')}
              >
                <Calendar className="mr-2 h-5 w-5" />
                <span className="font-semibold">Bookings</span>
              </button>
              <button
                className={`${
                  activeTab === 'timeSlots'
                    ? 'border-primary text-primary bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('timeSlots')}
              >
                <Clock className="mr-2 h-5 w-5" />
                <span className="font-semibold">Time Slots</span>
              </button>
              <button
                className={`${
                  activeTab === 'videos'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                onClick={() => setActiveTab('videos')}
              >
                <Film className="mr-2 h-5 w-5" />
                Videos
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
<<<<<<< Updated upstream
              <BookingsList
                bookings={bookings}
                updateBookingStatus={updateBookingStatus}
                deleteBooking={handleDeleteBooking}
              />
=======
              <div className="mt-6">
                <div className="flex justify-end mb-4">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                        viewMode === 'list'
                          ? 'bg-blue-50 text-blue-700 border border-blue-300'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      List View
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                        viewMode === 'calendar'
                          ? 'bg-blue-50 text-blue-700 border border-blue-300'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Calendar View
                    </button>
                  </div>
                </div>
                
                {viewMode === 'list' ? (
                  <BookingsList 
                    bookings={bookings} 
                    updateBookingStatus={updateBookingStatus} 
                    loading={loading}
                    error={error}
                    rescheduleBooking={rescheduleBooking}
                  />
                ) : (
                  <BookingsCalendarView 
                    bookings={bookings}
                    rescheduleBooking={rescheduleBooking}
                  />
                )}
              </div>
>>>>>>> Stashed changes
            )}
            {activeTab === 'timeSlots' && <AdminTimeSlots />}
            {activeTab === 'videos' && (
              <div>
                {!editingVideo ? (
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Videos</h2>
                    <button
<<<<<<< Updated upstream
                      onClick={() => setEditingVideo({
                        id: null as unknown as string,
                        title: '',
                        description: '',
                        video_url: '',
                        thumbnail_url: null,
                        video_source: 'default',
                        duration: '',
                        difficulty_level: '',
                        category_id: null,
                        individual_price: null,
                        is_premium: false,
                        created_at: '',
                        updated_at: ''
                      })}
=======
                      onClick={() => setEditingVideo({ 
                        id: null,
                        title: '',
                        description: '',
                        video_url: '',
                        is_premium: false
                      } as any)}
>>>>>>> Stashed changes
                      className="btn-primary flex items-center"
                    >
                      <Plus size={16} className="mr-2" />
                      Add New Video
                    </button>
                  </div>
                ) : null}
                
                {editingVideo ? (
                  <VideoForm
                    editingVideo={editingVideo}
                    videoCategories={videoCategories}
<<<<<<< Updated upstream
                    onSubmit={handleVideoSubmit}
=======
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const videoData = {
                        id: editingVideo.id,
                        title: formData.get('title') as string,
                        description: formData.get('description') as string,
                        video_url: formData.get('video_url') as string,
                        thumbnail_url: formData.get('thumbnail_url') as string || null,
                        category_id: formData.get('category_id') as string || null,
                        difficulty_level: formData.get('difficulty_level') as string || null,
                        duration: formData.get('duration') as string || null,
                        is_premium: formData.has('is_premium'),
                        individual_price: formData.get('individual_price') ? 
                          parseFloat(formData.get('individual_price') as string) : null
                      };
                      await handleVideoSubmit(videoData as VideoType);
                    }}
>>>>>>> Stashed changes
                    onCancel={() => setEditingVideo(null)}
                  />
                ) : (
                  <VideosList
                    videos={videos}
                    onEdit={setEditingVideo}
                    onDelete={deleteVideo}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;