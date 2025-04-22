import { useState, useEffect } from 'react';
import { Plus, UserCircle, Calendar, LucideClipboardList, LogOut, Clock, Users, FileText } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';
import { adminSupabase } from '../lib/adminSupabase';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';
import useWeb3Forms from '@web3forms/react';
import { format, parseISO } from 'date-fns';

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
import { sendEmail } from '../lib/emailService';
import { UserBookingConfirmationEmail } from '../email-templates/user/bookingConfirmEmail';
import { AdminBookingNotificationEmail } from '../email-templates/admin/bookingNotifyEmail';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [videoCategories, setVideoCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'mealPlans' | 'bookings' | 'timeSlots'>('mealPlans');
  const [editingMealPlan, setEditingMealPlan] = useState<MealPlan | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const { user, signOut } = useUserStore();
  const { user: authUser } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
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
      } catch (err) {
        console.error('Error in admin check:', err);
        navigate('/');
      }
    };

    checkAdmin();
  }, [authUser, navigate]);

  useEffect(() => {
    if (isAdmin && !isCheckingAdmin) {
      fetchData();
    }
  }, [isAdmin, isCheckingAdmin]);

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

      // Fetch meal plans using adminSupabase
      const { data: mealPlansData, error: mealPlansError } = await adminSupabase
        .from('meal_plans')
        .select('*')
        .order('title');

      if (mealPlansError) throw mealPlansError;
      
      console.log('Admin - Fetched meal plans:', mealPlansData);
      
      // Log each meal plan's content and thumbnail info for debugging
      if (mealPlansData) {
        mealPlansData.forEach((plan: any) => {
          console.log(`Admin - Meal plan ${plan.id} (${plan.title}):`);
          if (plan.thumbnail_url) {
            console.log('  Has thumbnail_url:', plan.thumbnail_url);
          }
          if (plan.content) {
            console.log('  Content structure:', Object.keys(plan.content));
            if (plan.content.metadata) {
              console.log('  Metadata:', plan.content.metadata);
            }
            if (plan.content.image) {
              console.log('  Has content.image:', plan.content.image);
            }
          }
        });
      }
      
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

      // Get the booking that was updated
      const updatedBooking = bookings.find(booking => booking.id === id);

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      ));
      
      // If the booking was confirmed, send a notification to the user
      if (status === 'confirmed' && updatedBooking) {
        await sendStatusUpdateNotification(updatedBooking, status);
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Failed to update booking status.');
    }
  };
  
  const sendStatusUpdateNotification = async (booking: Booking, status: BookingStatus) => {
    try {
      setIsSendingEmail(true);
      
      // Choose the appropriate subject based on status
      const emailSubject = status === 'confirmed' 
        ? 'Your Booking Has Been Confirmed!' 
        : 'Your Booking Status Has Been Updated!';
      const adminEmailSubject = status === 'confirmed'
        ? 'A booking has been Confirmed!'
        : 'A booking status has been Updated!';
      
      // Send user email
      await sendEmail({
        to: booking?.email || '',
        subject: emailSubject,
        reactTemplate: UserBookingConfirmationEmail({
          booking: {
            name: booking.name || '',
            date: booking.date,
            time: booking.date,
            notes: booking.notes,
          }
        }),
      })

      // Send admin email
      await sendEmail({
        to: import.meta.env.VITE_ADMIN_EMAILS.split(',') || [],
        subject: adminEmailSubject,
        reactTemplate: AdminBookingNotificationEmail({ 
          booking: {
            name: booking.name || '',
            date: booking.date,
            time: booking.date,
            notes: booking.notes,
          }
         }),
      })

      console.log(`Notification sent to ${booking.email} about booking ${status}`);
    } catch (err) {
      console.error('Error sending status update notification:', err);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleMealPlanSubmit = async (mealPlan: MealPlan, files?: { pdfFile?: File, thumbnailFile?: File }) => {
    try {
      let pdf_url = (mealPlan as any).pdf_url;
      // Store the thumbnail URL but don't save to database (column doesn't exist)
      let thumbnail_url = (mealPlan as any).thumbnail_url;
      
      console.log('Original meal plan before processing:', JSON.stringify(mealPlan));
      
      // Upload PDF file if provided
      if (files?.pdfFile) {
        const pdfFileName = `pdf-files/${Date.now()}-${files.pdfFile.name}`;
        
        try {
          const { error: pdfUploadError } = await adminSupabase.storage
            .from('Images') // Use 'Images' bucket for all files
            .upload(pdfFileName, files.pdfFile, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (pdfUploadError) {
            console.error('PDF upload error:', pdfUploadError);
            throw pdfUploadError;
          }
          
          // Get the public URL
          const { data: pdfData } = adminSupabase.storage
            .from('Images')
            .getPublicUrl(pdfFileName);
            
          pdf_url = pdfData.publicUrl;
        } catch (uploadError) {
          console.error('Error uploading PDF:', uploadError);
          // Continue without uploading the file
        }
      }
      
      // Upload thumbnail if provided - we'll upload it but not save the URL to database schema
      if (files?.thumbnailFile) {
        const thumbnailFileName = `meal-plans/${Date.now()}-${files.thumbnailFile.name}`;
        
        try {
          const { error: thumbnailUploadError } = await adminSupabase.storage
            .from('Images')
            .upload(thumbnailFileName, files.thumbnailFile, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (thumbnailUploadError) {
            console.error('Thumbnail upload error:', thumbnailUploadError);
            throw thumbnailUploadError;
          }
          
          // Get the public URL - we'll use this in UI but not save to database
          const { data: thumbnailData } = adminSupabase.storage
            .from('Images')
            .getPublicUrl(thumbnailFileName);
            
          thumbnail_url = thumbnailData.publicUrl;
          console.log('Thumbnail uploaded, URL for UI only:', thumbnail_url);
        } catch (uploadError) {
          console.error('Error uploading thumbnail:', uploadError);
          // Continue without uploading the file
        }
      }
      
      // Only include fields that exist in the database
      const { 
        id,
        title, 
        description, 
        price, 
        content,
        total_calories,
        total_protein,
        total_carbs,
        total_fat,
        duration_weeks,
        includes_grocery_list,
        includes_recipes,
        dietary_type,
        difficulty_level,
        preparation_time
      } = mealPlan;

      // Create a new content object with the thumbnail URL
      // We need to ensure it's properly structured for JSON serialization
      const existingContent = content || { weeks: [] };
      
      // Store the thumbnail URL in the metadata field
      const contentWithThumbnail = {
        ...existingContent,
        metadata: {
          ...(existingContent.metadata || {}),
          thumbnailUrl: thumbnail_url  // Store the URL in a field that won't conflict
        }
      };
      
      console.log('Modified content with thumbnail:', JSON.stringify(contentWithThumbnail));

      // Create a copy with only the fields we know exist in the database
      const mealPlanToSave = {
        title, 
        description, 
        price, 
        content: contentWithThumbnail, // Use the modified content with thumbnail
        total_calories,
        total_protein,
        total_carbs,
        total_fat,
        duration_weeks,
        includes_grocery_list,
        includes_recipes,
        dietary_type,
        difficulty_level,
        preparation_time
      };
      
      console.log('Meal plan to save to database:', JSON.stringify(mealPlanToSave));

      // Remove any URL properties that don't exist in the database
      delete (mealPlanToSave as any).pdf_url;
      delete (mealPlanToSave as any).thumbnail_url;
      
      // For UI purposes, create an object with all fields including URLs
      const mealPlanWithFiles = {
        ...mealPlanToSave,
        id,
        pdf_url,
        thumbnail_url // Store for UI but not in database
      };

      if (mealPlan.id) {
        // Update existing meal plan using adminSupabase
        const { error } = await adminSupabase
          .from('meal_plans')
          .update(mealPlanToSave)
          .eq('id', mealPlan.id);

        if (error) throw error;

        // For UI purposes only - include both URLs in the state
        setMealPlans(mealPlans.map(mp => 
          mp.id === mealPlan.id ? mealPlanWithFiles : mp
        ));
      } else {
        // Create new meal plan using adminSupabase
        const { data, error } = await adminSupabase
          .from('meal_plans')
          .insert([mealPlanToSave])
          .select();

        if (error) throw error;
        if (data) {
          // For UI purposes only - include both URLs in the state
          setMealPlans([...mealPlans, {...data[0], pdf_url, thumbnail_url: thumbnail_url}]);
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
      // First check if this meal plan has any purchases
      const { data: purchaseData, error: purchaseError } = await adminSupabase
        .from('purchases')
        .select('id')
        .eq('meal_plan_id', id);
        
      if (purchaseError) {
        console.error('Error checking purchases:', purchaseError);
      }
      
      // If there are purchases, we can't delete this meal plan
      if (purchaseData && purchaseData.length > 0) {
        setError(`Cannot delete this meal plan because it has been purchased ${purchaseData.length} time(s). Instead, you can hide it from the public view by editing it.`);
        return;
      }
      
      // If no purchases, proceed with deletion
      const { error } = await adminSupabase
        .from('meal_plans')
        .delete()
        .eq('id', id);

      if (error) {
        // Check specifically for foreign key constraint errors
        if (error.code === '23503') {
          setError('This meal plan cannot be deleted because it is linked to purchases. Consider hiding it instead of deleting it.');
        } else {
          throw error;
        }
        return;
      }
      
      setMealPlans(mealPlans.filter(mp => mp.id !== id));
      
    } catch (err) {
      console.error('Error deleting meal plan:', err);
      setError('Failed to delete meal plan. It may be linked to user purchases.');
    }
  };

  const toggleMealPlanVisibility = async (id: string, isHidden: boolean) => {
    try {
      console.log(`Toggling meal plan ${id} visibility to ${isHidden ? 'hidden' : 'visible'}`);
      
      // First get the current meal plan data
      const { data: currentData, error: fetchError } = await adminSupabase
        .from('meal_plans')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error('Error fetching meal plan for visibility update:', fetchError);
        setError('Failed to fetch meal plan data for visibility update.');
        return;
      }
      
      // Create or update the metadata in the content object
      const currentContent = currentData.content || {};
      const updatedContent = {
        ...currentContent,
        metadata: {
          ...(currentContent.metadata || {}),
          isHidden: isHidden
        }
      };
      
      console.log('Updated content with visibility status:', updatedContent);
      
      // Update the meal plan with the modified content
      const { error } = await adminSupabase
        .from('meal_plans')
        .update({ content: updatedContent })
        .eq('id', id);

      if (error) {
        console.error('Error toggling meal plan visibility:', error);
        setError('Failed to update meal plan visibility.');
        return;
      }
      
      // Update the state locally
      setMealPlans(mealPlans.map(mp => 
        mp.id === id ? { ...mp, content: updatedContent, is_hidden: isHidden } : mp
      ));
      
    } catch (err) {
      console.error('Error toggling meal plan visibility:', err);
      setError('Failed to update meal plan visibility.');
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
          <div className="pb-4 border-b">
            <nav className="flex space-x-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'users' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="mr-2 h-5 w-5" />
                Users
              </button>
              <button
                onClick={() => {
                  setActiveTab('mealPlans');
                  setEditingMealPlan(null);
                }}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'mealPlans' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="mr-2 h-5 w-5" />
                Meal Plans
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'bookings' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('timeSlots')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'timeSlots' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
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
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    >
                      Add New Meal Plan
                    </button>
                  </div>
                ) : null}
                
                {!editingMealPlan ? (
                  <MealPlansList
                    mealPlans={mealPlans}
                    onEdit={(mealPlan) => {
                      // Preserve the thumbnail_url when setting the meal plan for editing
                      const mealPlanWithThumbnail = {
                        ...mealPlan,
                        thumbnail_url: (mealPlan as any).thumbnail_url || undefined
                      };
                      setEditingMealPlan(mealPlanWithThumbnail);
                    }}
                    onDelete={deleteMealPlan}
                    onToggleVisibility={toggleMealPlanVisibility}
                  />
                ) : (
                  <MealPlanForm
                    editingMealPlan={editingMealPlan}
                    onSubmit={handleMealPlanSubmit}
                    onCancel={() => setEditingMealPlan(null)}
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
