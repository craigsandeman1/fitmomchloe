import { useEffect, useState, useRef } from 'react';
import { useMealPlanStore } from '../store/mealPlan';
import { useAuthStore } from '../store/auth';
import { Lock, ArrowRight, Utensils, Clock, ChevronRight, Play, Pause, Quote, ArrowDown, FileDown, CheckCircle, Repeat, GraduationCap, ShoppingCart } from 'lucide-react';
import { Auth } from '../components/Auth';
import RecipeModal from '../components/RecipeModal';
import PayfastButton from '../components/PayfastButton';
import { testMealPlanAccess, verifySupabaseConnection, checkSpecificMealPlan, forceInsertExampleMealPlan } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { sendPurchaseConfirmationEmail } from '../lib/emailUtils';
import chloeFood from '../assets/images/chloe-food.jpg';
import crumpetsBackground from '../assets/images/crumpets.webp';
import { MealPlan } from '../types/meal-plan';

// Helper function to get meal plan thumbnail or use default
const getMealPlanThumbnail = (plan: MealPlan): string => {
  // Try different possible property names for thumbnail
  if ((plan as any).thumbnail_url) {
    return (plan as any).thumbnail_url;
  }
  
  // If plan has image_url, use that
  if ((plan as any).image_url) {
    return (plan as any).image_url;
  }
  
  // Check if the content might have the image in metadata
  if (plan.content && (plan.content as any).metadata && (plan.content as any).metadata.thumbnailUrl) {
    console.log('Found thumbnail in content.metadata:', (plan.content as any).metadata.thumbnailUrl);
    return (plan.content as any).metadata.thumbnailUrl;
  }
  
  // Check other possible locations
  if (plan.content) {
    // Check directly on content
    if ((plan.content as any).image) {
      return (plan.content as any).image;
    }
    
    console.log('Content object but no thumbnail found:', plan.content);
  }
  
  // Default healthy food image from Unsplash
  return "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
};

// Helper function to check if a meal plan is hidden
const isMealPlanHidden = (plan: MealPlan): boolean => {
  // Check for is_hidden property directly (for UI state)
  if (typeof (plan as any).is_hidden === 'boolean') {
    return (plan as any).is_hidden;
  }
  
  // Check in content.metadata.isHidden (for database storage)
  if (plan.content && 
      (plan.content as any).metadata && 
      typeof (plan.content as any).metadata.isHidden === 'boolean') {
    return (plan.content as any).metadata.isHidden;
  }
  
  return false; // Default to visible
};

const MealPlans = () => {
  const { user } = useAuthStore();
  const { mealPlans, loading, error, fetchMealPlans, importSampleMealPlan } = useMealPlanStore();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [importingPlan, setImportingPlan] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [userPurchases, setUserPurchases] = useState<string[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ checked: false, ok: false, message: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<MealPlan | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('MealPlans component mounted');
    fetchMealPlans();
    
    // Diagnostic check for specific meal plan
    const checkMealPlan = async () => {
      const result = await checkSpecificMealPlan();
      console.log('Specific meal plan check result:', result);
      
      // If the specific meal plan isn't found or if there are no meal plans in the store,
      // display an alert to help debugging
      setTimeout(() => {
        const storedMealPlans = useMealPlanStore.getState().mealPlans;
        if (storedMealPlans.length === 0) {
          console.warn('No meal plans found in the store after fetching!');
          
          // Try to identify why
          if (!result.exists) {
            console.warn('The specific meal plan also could not be found in Supabase. This might indicate:');
            console.warn('1. The meal plan record does not exist in the database');
            console.warn('2. Row Level Security is preventing access to the meal plan');
            console.warn('3. There might be a connection or API error with Supabase');
          } else {
            console.warn('Specific meal plan exists in Supabase but is not showing up in the UI. This might indicate:');
            console.warn('1. The meal_plans table does not have the expected structure');
            console.warn('2. The meal plan is being filtered out by is_active or is_hidden');
            console.warn('3. There might be an issue with the filter/map in the UI rendering');
          }
        }
      }, 2000);
    };
    
    checkMealPlan();
  }, []);

  useEffect(() => {
    console.log('Auth state:', { user });
    console.log('Meal plans state:', { 
      count: mealPlans.length,
      loading, 
      error,
      plans: mealPlans
    });
    
    if (user) {
      fetchUserPurchases();
    } else {
      setUserPurchases([]);
    }
  }, [user, mealPlans, loading, error]);

  useEffect(() => {
    if (user) {
      testConnection();
    }
  }, [user]);

  const testConnection = async () => {
    try {
      const connectionResult = await verifySupabaseConnection();
      console.log('Connection test result:', connectionResult);
      
      if (!connectionResult.connected) {
        setConnectionStatus({
          checked: true,
          ok: false,
          message: `Connection error: ${connectionResult.error}`
        });
        return;
      }
      
      // Check RLS policies by running a simple query
      const { data: rlsData, error: rlsError } = await supabase
        .from('meal_plans')
        .select('count');
      
      console.log('RLS test result:', { 
        success: !rlsError, 
        data: rlsData, 
        error: rlsError ? rlsError.message : null 
      });
      
      const accessResult = await testMealPlanAccess();
      console.log('Access test result:', accessResult);
      
      setConnectionStatus({
        checked: true,
        ok: accessResult.access,
        message: accessResult.access 
          ? 'Connection successful' 
          : `Access error: ${accessResult.error}`
      });
      
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus({
        checked: true,
        ok: false,
        message: `Test error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleImportSample = async () => {
    setImportingPlan(true);
    try {
      // Try to force-insert the example meal plan directly
      const result = await forceInsertExampleMealPlan();
      console.log('Force insert result:', result);
      
      if (result.success) {
        // If successful, fetch meal plans to update the UI
        await fetchMealPlans();
        console.log('Meal plans refreshed after import');
      } else {
        // If direct insert fails, fall back to the original import method
        console.log('Falling back to default import method');
        await importSampleMealPlan();
      }
    } finally {
      setImportingPlan(false);
    }
  };

  const fetchUserPurchases = async () => {
    if (!user) return;
    
    try {
      setPurchaseLoading(true);
      console.log('Fetching purchases for user:', user.id);
      
      const { data, error } = await supabase
        .from('purchases')
        .select('meal_plan_id, created_at')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching user purchases:', error);
        return;
      }
      
      console.log('Raw purchase data:', data);
      
      // Group purchases by meal plan ID to detect duplicates
      const purchasesByPlan = data?.reduce((acc: {[key: string]: any[]}, item) => {
        if (!acc[item.meal_plan_id]) {
          acc[item.meal_plan_id] = [];
        }
        acc[item.meal_plan_id].push(item);
        return acc;
      }, {});
      
      console.log('Purchases grouped by plan:', purchasesByPlan);
      
      const purchasedIds = data?.map(p => p.meal_plan_id) || [];
      
      // Get unique IDs to remove duplicates
      const uniquePurchasedIds = [...new Set(purchasedIds)];
      console.log('Unique purchased meal plans:', uniquePurchasedIds);
      
      // Use unique IDs instead of all IDs with duplicates
      setUserPurchases(uniquePurchasedIds);
      console.log('User has purchased these meal plans (unique):', uniquePurchasedIds);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    } finally {
      setPurchaseLoading(false);
    }
  };
  
  const hasPurchased = (planId: string | null): boolean => {
    if (!planId || !user) return false;
    return userPurchases.includes(planId);
  };

  const handlePurchaseSuccess = async (planId: string) => {
    setPurchaseSuccess(planId);
    console.log(`Successfully purchased meal plan: ${planId}`);
    
    // Find the plan to get its details
    const plan = mealPlans.find(p => p.id === planId);
    if (!plan) return;
    
    // Record the purchase in the database
    if (user && planId) {
      try {        
        const { error } = await supabase
          .from('purchases')
          .insert([
            {
              user_id: user.id,
              meal_plan_id: planId,
              amount: plan.price,
              payment_id: `payfast_${Date.now()}` // In real app, use actual payment ID from Payfast
            }
          ]);
          
        if (error) {
          console.error('Error recording purchase:', error);
          return;
        }
        
        // Refresh the user's purchases list
        fetchUserPurchases();
      } catch (err) {
        console.error('Error recording purchase:', err);
      }
    }
    
    // Send purchase confirmation email
    try {
      // Create a download link for the plan
      // Note: In production, this should be a secure, time-limited link
      const downloadLink = `${window.location.origin}/meal-plans?download=${planId}`;

      // Get user's email (from user object or session)
      const userEmail = user?.email;
      
      if (userEmail && plan.title) {
        // Send the purchase confirmation email
        await sendPurchaseConfirmationEmail(
          userEmail,
          plan.title,
          downloadLink,
          user?.user_metadata?.name || undefined
        );
        console.log('Purchase confirmation email sent');
      } else {
        console.warn('Could not send purchase confirmation email - missing email or plan title');
      }
    } catch (emailError) {
      console.error('Error sending purchase confirmation email:', emailError);
      // Don't block the purchase process if email fails
    }
    
    // Trigger download for the purchased plan
    setTimeout(() => {
      downloadPurchasedPlan(planId);
    }, 1000);
  };
  
  // Helper function for handling free plan acquisition
  const acquireFreePlan = (plan: MealPlan) => {
    if (plan.id) {
      handlePurchaseSuccess(plan.id);
    }
  };
  
  const downloadPurchasedPlan = (planId: string) => {
    const plan = mealPlans.find(p => p.id === planId);
    if (!plan) return;
    
    console.log('Downloading plan:', plan);
    
    // Check if the plan has a PDF URL
    if ((plan as any).pdf_url) {
      console.log('Opening PDF URL:', (plan as any).pdf_url);
      window.open((plan as any).pdf_url, '_blank');
    } else {
      // If no direct PDF URL, create a download link for the plan
      // This is a simplified example - in production you would have a secure download endpoint
      console.log('No PDF URL found, creating blob from content');
      const blob = new Blob([JSON.stringify(plan.content)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${plan.title.replace(/\s+/g, '_')}_meal_plan.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePurchaseCancel = () => {
    setPendingPurchase(null);
    console.log('Purchase was cancelled');
  };
  
  // Handle purchase attempt - check if user is logged in first
  const handlePurchaseAttempt = (plan: MealPlan) => {
    console.log('MealPlans: handlePurchaseAttempt called for plan', plan.title);
    
    // No longer requiring authentication to purchase
    // Just check if the user has already purchased (if logged in)
    if (user && hasPurchased(plan.id)) {
      // Already purchased, just download it
      downloadPurchasedPlan(plan.id || '');
    } else {
      // Either not logged in or hasn't purchased, proceed with Payfast
      console.log('MealPlans: Proceeding with payment...');
      
      // Let PayfastButton handle it
      return false;
    }
  };
  
  // Handle when user successfully authenticates from the auth modal
  const handleAuthModalSuccess = () => {
    // Close the auth modal
    setShowAuthModal(false);
    
    // If there was a pending purchase and user is now authenticated, proceed with purchase
    if (pendingPurchase && user) {
      console.log('User authenticated, proceeding with purchase:', pendingPurchase.title);
      
      // For paid plans, the PayfastButton will handle the purchase
      // This is triggered automatically because the modal is closed and user is logged in
      
      // For free plans, we need to handle it directly
      if (pendingPurchase.price === 0 && pendingPurchase.id) {
        handlePurchaseSuccess(pendingPurchase.id);
      }
    }
  };
  
  // Auth modal component
  const AuthModal = () => {
    if (!showAuthModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="font-playfair text-2xl mb-4 text-center">Sign In to Continue</h3>
          <p className="text-gray-600 mb-6 text-center">
            You need to sign in to purchase this meal plan. Once signed in, you'll be able to access all your purchases anytime.
          </p>
          <Auth 
            purchaseFlow={true} 
            onAuthSuccess={handleAuthModalSuccess}
          />
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-background overflow-hidden">
        {/* Hero Section with Video Overlay */}
        <div className="relative bg-black w-full">
          {/* Background Image with Parallax Effect */}
          <div className="absolute inset-0 z-0 opacity-70 w-full">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt="Healthy food background"
              className="w-full h-full object-cover transform scale-105 origin-center"
              style={{ 
                objectPosition: "center 30%",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/60 to-black/20" />
          </div>
          
          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left Side: Video Thumbnail */}
              <div className="w-full lg:w-[450px] flex-shrink-0 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group aspect-[9/16] transform hover:scale-[1.02] transition-all duration-500">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/meal-plans.mp4"
                    poster={chloeFood}
                    preload="metadata"
                    playsInline
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-2 -left-2 w-16 h-16 border-l-4 border-t-4 border-primary opacity-70 rounded-tl-xl"></div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 border-r-4 border-b-4 border-primary opacity-70 rounded-br-xl"></div>
                  
                  {/* Play Button Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-all duration-500"
                    onClick={toggleVideo}
                  >
                    {!isPlaying && (
                      <button 
                        className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 shadow-lg shadow-primary/30"
                        aria-label="Play video"
                      >
                        <Play className="w-10 h-10 text-white ml-2" />
                      </button>
                    )}
                  </div>
                  
                  {/* Video Controls Indicator - Only shown when playing */}
                  {isPlaying && (
                    <div className="absolute top-6 right-6 bg-black/50 rounded-full p-2 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Pause 
                        className="w-6 h-6 text-white cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVideo();
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black p-4">
                    <span className="text-white font-medium text-lg">
                      Watch: Why I don't count calories
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Right Side: Text Content */}
              <div className="flex-1 text-white order-1 lg:order-2">
                <h1 className="font-playfair text-5xl md:text-6xl mb-8 leading-tight">
                  Transform Your <span className="text-primary">Nutrition</span> <span className="text-white">Journey</span>
                </h1>
                
                <div className="mb-10 text-xl leading-relaxed">
                  <p className="mb-8 text-white/90">
                    Start your journey with personalized meal plans designed to help you achieve your goals, 
                    without the stress of counting every calorie.
                  </p>
                  
                  {/* Quote */}
                  <div className="relative border-l-4 border-primary pl-8 py-4 italic mt-10 mb-10 bg-white/5 backdrop-blur-sm rounded-r-lg shadow-lg">
                    <Quote className="absolute -top-4 -left-6 text-primary w-12 h-12 bg-black rounded-full p-2 shadow-lg shadow-primary/20" />
                    <p className="text-white/95 text-xl">
                      "I believe in a balanced approach to nutrition that doesn't involve obsessively 
                      counting calories or following restrictive diets. My plans are about nourishing 
                      your body with real food that makes you feel good."
                    </p>
                    <p className="text-primary mt-4 text-lg font-medium">— Chloe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Meal Plans Section */}
        <div id="available-plans" className="bg-gray-50 py-24 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-16">
              <h2 className="font-playfair text-4xl text-center">Available Meal Plans</h2>
            </div>
            
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4 rounded-lg">
                {error}
              </div>
            ) : mealPlans.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No meal plans available at the moment.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mealPlans
                    .filter(plan => !isMealPlanHidden(plan))
                    .map((plan) => (
                      <div key={plan.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={getMealPlanThumbnail(plan)} 
                            alt={plan.title} 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                          />
                          {plan.price > 0 && !hasPurchased(plan.id) && (
                            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full font-medium">
                              R{plan.price.toFixed(2)}
                            </div>
                          )}
                          {hasPurchased(plan.id) && (
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-medium flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Purchased
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <h3 className="font-playfair text-2xl mb-3">{plan.title}</h3>
                          
                          <p className="text-gray-600 mb-6 line-clamp-3">
                            {plan.description || "A comprehensive meal plan designed to help you achieve your nutrition goals."}
                          </p>
                          
                          <div className="flex flex-wrap gap-3 mb-6">
                            {(plan as any).dietary_type && (
                              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                {(plan as any).dietary_type}
                              </span>
                            )}
                            {(plan as any).duration_weeks && (
                              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                {(plan as any).duration_weeks} {(plan as any).duration_weeks === 1 ? 'Week' : 'Weeks'}
                              </span>
                            )}
                            {(plan as any).difficulty_level && (
                              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                {(plan as any).difficulty_level}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-auto">
                            {hasPurchased(plan.id) ? (
                              <button
                                onClick={() => downloadPurchasedPlan(plan.id || '')}
                                className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] hover:from-[#43A047] hover:to-[#5CB860] shadow-lg shadow-green-500/30 transform transition-all duration-200 hover:scale-[1.02] text-white rounded-lg flex items-center justify-center"
                              >
                                <FileDown className="mr-2 h-5 w-5" />
                                Download Plan
                              </button>
                            ) : purchaseSuccess === plan.id ? (
                              <div className="text-center py-3 bg-green-500 text-white rounded-lg">
                                Thank you for your purchase!
                              </div>
                            ) : (
                              <>
                                {plan.price > 0 ? (
                                  <PayfastButton
                                    plan={plan}
                                    onSuccess={handlePurchaseSuccess}
                                    onCancel={handlePurchaseCancel}
                                    handlePurchaseAttempt={handlePurchaseAttempt}
                                    className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] shadow-lg shadow-primary/30 transform transition-all duration-200 hover:scale-[1.02]"
                                  />
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (plan.id) handlePurchaseSuccess(plan.id);
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] shadow-lg shadow-primary/30 transform transition-all duration-200 hover:scale-[1.02] text-white rounded-lg flex items-center justify-center"
                                  >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Get Free Plan
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Nutrition Features Section */}
        <div id="nutrition-philosophy" className="bg-gradient-to-br from-[#F8F3EF] via-[#F2E9E0] to-[#EDD9C7] py-24 w-full relative overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={crumpetsBackground} 
              alt="Background food texture" 
              className="w-full h-full object-cover opacity-20 mix-blend-multiply"
            />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-[#B0826E]/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#B0826E]/5 rounded-full translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/4 right-10 w-20 h-20 bg-[#B0826E]/10 rounded-full"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-[#B0826E]/10 text-[#B0826E] font-medium rounded-full text-sm mb-4">NUTRITION APPROACH</span>
              <h2 className="font-playfair text-4xl md:text-5xl mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#B0826E] to-[#9A715F]">My Nutrition Philosophy</h2>
              <div className="w-20 h-1 bg-[#B0826E] mx-auto rounded-full mb-6"></div>
              <p className="max-w-2xl mx-auto text-gray-600">Discover a balanced approach to nutrition that focuses on nourishment, not restriction. Food should fuel your life, not complicate it.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-8 hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:-translate-y-1 border border-[#EAD9C6]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B0826E]/10 mb-6">
                  <Utensils className="w-8 h-8 text-[#B0826E]" />
                </div>
                <h3 className="font-playfair text-2xl mb-4">Balanced Nutrition</h3>
                <p className="text-gray-600 leading-relaxed">
                  My approach focuses on nourishing your body with whole, nutrient-dense foods 
                  that fuel your workouts and support your overall health goals.
                </p>
              </div>
              
              <div className="bg-white p-8 hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:-translate-y-1 border border-[#EAD9C6]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B0826E]/10 mb-6">
                  <Repeat className="w-8 h-8 text-[#B0826E]" />
                </div>
                <h3 className="font-playfair text-2xl mb-4">Sustainable Results</h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn how to create lasting habits that will help you maintain your results 
                  long-term, while still enjoying the foods you love.
                </p>
              </div>
              
              <div className="bg-white p-8 hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:-translate-y-1 border border-[#EAD9C6]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B0826E]/10 mb-6">
                  <GraduationCap className="w-8 h-8 text-[#B0826E]" />
                </div>
                <h3 className="font-playfair text-2xl mb-4">Expert Guidance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized nutrition advice and meal plans tailored to your specific needs 
                  and goals. I'll guide you every step of the way.
                </p>
              </div>
            </div>
          </div>
        </div>

        <RecipeModal
          isOpen={selectedRecipe !== null}
          onClose={() => setSelectedRecipe(null)}
          recipe={selectedRecipe}
        />
      </div>
      
      {/* Authentication Modal */}
      <AuthModal />
    </>
  );
};

export default MealPlans;
