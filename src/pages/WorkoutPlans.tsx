import React, { useState, useEffect, useRef } from 'react';
import { useWorkoutPlanStore } from '../store/workoutPlan';
import { useAuthStore } from '../store/auth';
import { WorkoutPlan } from '../types/workout-plan';
import { 
  CheckCircle, 
  ShoppingCart, 
  Dumbbell, 
  Target, 
  Clock,
  TrendingUp,
  Star,
  Zap,
  Play,
  Pause
} from 'lucide-react';
import { getWorkoutPlanThumbnail, formatWorkoutDuration, formatFitnessType, getDifficultyColor, formatCaloriesBurned } from '../lib/workoutPlanHelpers';
import { Auth } from '../components/Auth';
import PayfastButton from '../components/PayfastButton';
import { supabase } from '../lib/supabase';
import workoutBackground from '../assets/images/workingout.jpg';
import { jsPDF } from 'jspdf';

// Helper function to check if a workout plan is hidden
const isWorkoutPlanHidden = (plan: WorkoutPlan): boolean => {
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

const WorkoutPlans = () => {
  const { user } = useAuthStore();
  const { workoutPlans, loading, error, fetchWorkoutPlans, importSampleWorkoutPlan } = useWorkoutPlanStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [importingPlan, setImportingPlan] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [userPurchases, setUserPurchases] = useState<string[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ checked: false, ok: false, message: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<WorkoutPlan | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  // Fetch user purchases when user is available
  useEffect(() => {
    const fetchUserPurchases = async () => {
      if (!user) {
        setUserPurchases([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('workout_plan_purchases')
          .select('workout_plan_id')
          .eq('user_id', user.id)
          .eq('status', 'completed');

        if (error) {
          console.error('Error fetching user purchases:', error);
          return;
        }

        const purchasedPlanIds = data.map(purchase => purchase.workout_plan_id);
        setUserPurchases(purchasedPlanIds);
      } catch (error) {
        console.error('Error fetching user purchases:', error);
      }
    };

    fetchUserPurchases();
  }, [user]);

  // Check if user has purchased a plan
  const hasPurchased = (planId: string | null) => {
    if (!planId || !user) return false;
    return userPurchases.includes(planId);
  };

  const handlePurchaseSuccess = async (planId: string) => {
    console.log('WorkoutPlans: Purchase success for plan ID:', planId);
    setPurchaseSuccess(planId);
    
    // Add to user purchases immediately for UI feedback
    setUserPurchases(prev => [...prev, planId]);
    
    // Hide the success message after 5 seconds
    setTimeout(() => {
      setPurchaseSuccess(null);
    }, 5000);
  };

  const downloadPurchasedPlan = (planId: string) => {
    const plan = workoutPlans.find(p => p.id === planId);
    if (!plan) return;
    
    console.log('Downloading plan:', plan);
    
    // Check if the plan has a PDF URL (direct property or in metadata)
    const pdfUrl = (plan as any).pdf_url || plan.content?.metadata?.pdfUrl;
    
    if (pdfUrl) {
      console.log('Opening PDF URL:', pdfUrl);
      window.open(pdfUrl, '_blank');
      return;
    }
    
    // Generate PDF on the fly using jsPDF
    console.log('Generating PDF from content');
    const doc = new jsPDF();
    
    // Add title with better styling
    doc.setFontSize(24);
    doc.setTextColor(230, 130, 124); // Primary color
    doc.text(`Workout Plan: ${plan.title}`, 20, 25);
    
    // Add subtitle
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Your Personal Fitness Journey Starts Here', 20, 35);
    
    // Reset color to black for main content
    doc.setTextColor(0, 0, 0);
    
    // Add description
    doc.setFontSize(12);
    doc.text('Description:', 20, 50);
    
    // Handle long descriptions by wrapping text
    const splitDescription = doc.splitTextToSize(plan.description || 'A comprehensive workout plan designed to help you achieve your fitness goals.', 170);
    doc.text(splitDescription, 20, 60);
    
    let yPosition = 60 + (splitDescription.length * 7);
    
    // Add workout details section
    doc.setFontSize(16);
    doc.setTextColor(230, 130, 124);
    doc.text('Plan Details', 20, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;
    
    // Create a details box
    doc.setFontSize(11);
    const details = [
      `💰 Investment: R${plan.price.toFixed(2)}`,
      plan.fitness_type ? `🎯 Focus: ${formatFitnessType(plan.fitness_type)}` : null,
      plan.difficulty_level ? `📊 Level: ${plan.difficulty_level}` : null,
      plan.workout_duration ? `⏱️ Duration: ${formatWorkoutDuration(plan.workout_duration)}` : null,
      plan.duration_weeks ? `📅 Program Length: ${plan.duration_weeks} ${plan.duration_weeks === 1 ? 'week' : 'weeks'}` : null,
      plan.estimated_calories_burned ? `🔥 Calories: ${formatCaloriesBurned(plan.estimated_calories_burned)}` : null,
      plan.target_muscle_groups ? `💪 Target Areas: ${plan.target_muscle_groups}` : null,
    ].filter(Boolean);
    
    details.forEach((detail, index) => {
      doc.text(detail!, 25, yPosition + (index * 8));
    });
    
    yPosition += details.length * 8 + 10;
    
    // Add included features
    doc.setFontSize(14);
    doc.setTextColor(230, 130, 124);
    doc.text('What\'s Included:', 20, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
    
    doc.setFontSize(11);
    const features = [];
    if (plan.includes_equipment_list) features.push('✅ Complete Equipment List');
    if (plan.includes_exercise_descriptions) features.push('✅ Detailed Exercise Descriptions');
    features.push('✅ Progressive Training Structure');
    features.push('✅ Professional Guidance');
    
    features.forEach((feature, index) => {
      doc.text(feature, 25, yPosition + (index * 8));
    });
    
    yPosition += features.length * 8 + 15;
    
    // Add workout content if available
    if (plan.content && plan.content.weeks && plan.content.weeks.length > 0) {
      doc.setFontSize(18);
      doc.setTextColor(230, 130, 124);
      doc.text('Your Workout Program', 20, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 15;
      
      plan.content.weeks.forEach((week, weekIndex) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.setTextColor(230, 130, 124);
        doc.text(`Week ${week.weekNumber}`, 20, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 12;
        
        week.days.forEach((day, dayIndex) => {
          // Check if we need a new page
          if (yPosition > 260) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(14);
          doc.setTextColor(100, 100, 100);
          doc.text(`📅 ${day.day}`, 25, yPosition);
          doc.setTextColor(0, 0, 0);
          yPosition += 10;
          
          day.workouts.forEach((workout, workoutIndex) => {
            // Check if we need a new page
            if (yPosition > 265) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.setFontSize(12);
            doc.text(`🏋️ ${workout.name}`, 30, yPosition);
            yPosition += 8;
            
            if (workout.type) {
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              doc.text(`Type: ${workout.type}`, 35, yPosition);
              yPosition += 6;
            }
            
            if (workout.duration) {
              doc.text(`Duration: ${workout.duration}`, 35, yPosition);
              yPosition += 6;
            }
            
            if (workout.sets && workout.reps) {
              doc.text(`Sets: ${workout.sets} x ${workout.reps}`, 35, yPosition);
              yPosition += 6;
            }
            
            if (workout.rest) {
              doc.text(`Rest: ${workout.rest}`, 35, yPosition);
              yPosition += 6;
            }
            
            doc.setTextColor(0, 0, 0);
            
            // Add exercises if available
            if (workout.exercises && workout.exercises.length > 0) {
              workout.exercises.forEach((exercise, exerciseIndex) => {
                // Check if we need a new page
                if (yPosition > 275) {
                  doc.addPage();
                  yPosition = 20;
                }
                
                doc.setFontSize(9);
                doc.text(`• ${exercise.name}: ${exercise.sets} sets x ${exercise.reps}`, 40, yPosition);
                if (exercise.rest) {
                  doc.text(` (Rest: ${exercise.rest})`, 40, yPosition + 4);
                  yPosition += 8;
                } else {
                  yPosition += 6;
                }
              });
            }
            
            yPosition += 4; // Extra space between workouts
          });
          
          yPosition += 6; // Extra space between days
        });
        
        yPosition += 10; // Extra space between weeks
      });
    }
    
    // Add motivational footer
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(230, 130, 124);
    doc.text('Remember:', 20, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
    
    doc.setFontSize(11);
    const motivationalText = [
      '• Consistency is key to achieving your fitness goals',
      '• Listen to your body and progress at your own pace',
      '• Proper form is more important than heavy weight',
      '• Rest and recovery are essential parts of your journey',
      '• Celebrate every small victory along the way!'
    ];
    
    motivationalText.forEach((text, index) => {
      doc.text(text, 25, yPosition + (index * 8));
    });
    
    // Add footer with date and branding
    const today = new Date();
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Downloaded on ${today.toLocaleDateString()}`, 20, 285);
    doc.text('© Fit Mom Chloe - Your Fitness Journey Partner', 120, 285);
    
    // Save the PDF
    doc.save(`${plan.title.replace(/\s+/g, '_')}_workout_plan.pdf`);
  };

  const handlePurchaseCancel = () => {
    setPendingPurchase(null);
    console.log('Purchase was cancelled');
  };
  
  // Handle purchase attempt - updated to work with PayfastButton
  const handlePurchaseAttempt = (plan: WorkoutPlan) => {
    console.log('WorkoutPlans: handlePurchaseAttempt called for plan', plan.title);
    
    if (!user) {
      // Show auth modal
      setPendingPurchase(plan);
      setShowAuthModal(true);
      return true; // Return true to indicate we handled it
    }

    if (hasPurchased(plan.id)) {
      // Already purchased, just download it
      downloadPurchasedPlan(plan.id || '');
      return true; // Return true to indicate we handled it
    } else {
      // For free plans, handle directly
      if (plan.price === 0) {
        if (plan.id) {
          handlePurchaseSuccess(plan.id);
        }
        return true; // Return true to indicate we handled it
      }
      
      // For paid plans, return false to let PayfastButton handle the payment flow
      return false;
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
      await importSampleWorkoutPlan();
    } catch (error) {
      console.error('Error importing sample workout plan:', error);
    } finally {
      setImportingPlan(false);
    }
  };

  // Handle when user successfully authenticates from the auth modal
  const handleAuthModalSuccess = () => {
    // Close the auth modal
    setShowAuthModal(false);
    
    // If there was a pending purchase and user is now authenticated, proceed with purchase
    if (pendingPurchase && user) {
      console.log('User authenticated, proceeding with purchase:', pendingPurchase.title);
      
      // For free plans, we need to handle it directly
      if (pendingPurchase.price === 0 && pendingPurchase.id) {
        handlePurchaseSuccess(pendingPurchase.id);
      }
      // For paid plans, would trigger payment flow
      else {
        console.log('Would proceed with payment for:', pendingPurchase.title);
        if (pendingPurchase.id) {
          handlePurchaseSuccess(pendingPurchase.id);
        }
      }
    }
    setPendingPurchase(null);
  };
  
  // Auth modal component
  const AuthModal = () => {
    if (!showAuthModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="font-playfair text-2xl mb-4 text-center">Sign In to Continue</h3>
          <p className="text-gray-600 mb-6 text-center">
            You need to sign in to purchase this workout plan. Once signed in, you'll be able to access all your purchases anytime.
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
      <div>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-background min-h-[85vh]">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={workoutBackground}
              alt="Workout background" 
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
          </div>

          <div className="relative min-h-[85vh] flex items-center">
            <div className="section-container">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Column */}
                <div>
                  <h1 className="font-playfair text-5xl md:text-6xl mb-6">
                    Transform Your Body with{' '}
                    <span className="text-primary">Professional Workout Plans</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Get access to expertly designed workout plans that deliver real results. 
                    From beginner-friendly routines to advanced training programs.
                  </p>

                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Expert Designed</h3>
                        <p className="text-sm text-gray-600">By certified trainers</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Goal Focused</h3>
                        <p className="text-sm text-gray-600">Targeted results</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Time Efficient</h3>
                        <p className="text-sm text-gray-600">30-60 minute workouts</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Progressive</h3>
                        <p className="text-sm text-gray-600">Build strength safely</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => {
                      const element = document.getElementById('available-plans');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-primary hover:-translate-y-1 transition-all"
                  >
                    View Workout Plans
                  </button>
                </div>

                {/* Right Column - Featured Video Preview */}
                <div className="relative aspect-[4/3] bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                    alt="Workout Plans Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-medium mb-2">Professional Workout Plans</h3>
                      <p className="text-white/80 text-sm">
                        Detailed exercise guides, progression tracking, and expert tips
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans Section */}
        <div id="available-plans" className="bg-gray-50 py-24 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-16">
              <h2 className="font-playfair text-4xl text-center">Available Workout Plans</h2>
            </div>
            
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4 rounded-lg">
                {error}
              </div>
            ) : workoutPlans.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No workout plans available at the moment.</p>
                {user && (
                  <button
                    onClick={handleImportSample}
                    disabled={importingPlan}
                    className="mt-4 btn-primary"
                  >
                    {importingPlan ? 'Importing...' : 'Import Sample Plan'}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {workoutPlans
                  .filter(plan => !isWorkoutPlanHidden(plan))
                  .map((plan) => (
                    <div key={plan.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={getWorkoutPlanThumbnail(plan)} 
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
                          {plan.description || "A comprehensive workout plan designed to help you achieve your fitness goals."}
                        </p>
                        
                        <div className="flex flex-wrap gap-3 mb-6">
                          {plan.fitness_type && (
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                              {formatFitnessType(plan.fitness_type)}
                            </span>
                          )}
                          {plan.duration_weeks && (
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                              {plan.duration_weeks} {plan.duration_weeks === 1 ? 'Week' : 'Weeks'}
                            </span>
                          )}
                          {plan.difficulty_level && (
                            <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(plan.difficulty_level)}`}>
                              {plan.difficulty_level}
                            </span>
                          )}
                          {plan.workout_duration && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {formatWorkoutDuration(plan.workout_duration)}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2 mb-6 text-sm text-gray-600">
                          {plan.estimated_calories_burned && (
                            <div className="flex items-center">
                              <Zap className="w-4 h-4 mr-2 text-orange-500" />
                              <span>{formatCaloriesBurned(plan.estimated_calories_burned)} per session</span>
                            </div>
                          )}
                          {plan.target_muscle_groups && (
                            <div className="flex items-center">
                              <Target className="w-4 h-4 mr-2 text-blue-500" />
                              <span>{plan.target_muscle_groups}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {hasPurchased(plan.id) ? (
                            <button
                              onClick={() => downloadPurchasedPlan(plan.id || '')}
                              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
                            >
                              <CheckCircle className="mr-2 h-5 w-5" />
                              Download Plan
                            </button>
                          ) : (
                            <>
                              {plan.price > 0 ? (
                                <PayfastButton
                                  plan={plan as any} // Cast to bypass TypeScript type checking
                                  customStr2={user?.id} // Pass user ID for webhook
                                  onSuccess={handlePurchaseSuccess}
                                  onCancel={handlePurchaseCancel}
                                  handlePurchaseAttempt={handlePurchaseAttempt as any} // Cast to bypass TypeScript type checking
                                  className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] shadow-lg shadow-primary/30 transform transition-all duration-200 hover:scale-[1.02]"
                                />
                              ) : (
                                <button
                                  onClick={() => handlePurchaseAttempt(plan)}
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
            )}
          </div>
        </div>

        {/* Fitness Philosophy Section */}
        <div className="relative py-24 bg-white overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-[#B0826E]/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#B0826E]/5 rounded-full translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/4 right-10 w-20 h-20 bg-[#B0826E]/10 rounded-full"></div>
          
          <div className="relative section-container">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-[#B0826E]/10 text-[#B0826E] font-medium rounded-full text-sm mb-4">FITNESS APPROACH</span>
              <h2 className="font-playfair text-4xl md:text-5xl mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#B0826E] to-[#9A715F]">My Fitness Philosophy</h2>
              <div className="w-20 h-1 bg-[#B0826E] mx-auto rounded-full mb-6"></div>
              <p className="max-w-2xl mx-auto text-gray-600">Discover a balanced approach to fitness that focuses on building strength, improving health, and creating sustainable habits for life.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-8 hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:-translate-y-1 border border-[#EAD9C6]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B0826E]/10 mb-6">
                  <Dumbbell className="w-8 h-8 text-[#B0826E]" />
                </div>
                <h3 className="font-playfair text-2xl mb-4">Functional Fitness</h3>
                <p className="text-gray-600 leading-relaxed">
                  My approach focuses on movements that translate to real-life activities, 
                  building strength and mobility that enhances your daily life.
                </p>
              </div>
              
              <div className="bg-white p-8 hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:-translate-y-1 border border-[#EAD9C6]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B0826E]/10 mb-6">
                  <TrendingUp className="w-8 h-8 text-[#B0826E]" />
                </div>
                <h3 className="font-playfair text-2xl mb-4">Progressive Training</h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn how to gradually increase intensity and challenge your body safely 
                  to achieve consistent, long-term progress.
                </p>
              </div>
              
              <div className="bg-white p-8 hover:shadow-xl transition-all duration-300 rounded-2xl transform hover:-translate-y-1 border border-[#EAD9C6]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B0826E]/10 mb-6">
                  <Star className="w-8 h-8 text-[#B0826E]" />
                </div>
                <h3 className="font-playfair text-2xl mb-4">Expert Guidance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized workout plans and expert advice tailored to your specific goals, 
                  fitness level, and lifestyle needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Authentication Modal */}
      <AuthModal />
    </>
  );
};

export default WorkoutPlans; 