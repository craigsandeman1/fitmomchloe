import { useEffect, useState, useRef } from 'react';
import { useMealPlanStore } from '../store/mealPlan';
import { useAuthStore } from '../store/auth';
import { Lock, ArrowRight, Utensils, Clock, ChevronRight, Play, Pause, Quote, ArrowDown } from 'lucide-react';
import { Auth } from '../components/Auth';
import RecipeModal from '../components/RecipeModal';
import { testMealPlanAccess, verifySupabaseConnection } from '../lib/supabase';
import chloeFood from '../assets/images/chloe-food.jpg';

const MealPlans = () => {
  const { user } = useAuthStore();
  const { mealPlans, loading, error, fetchMealPlans, importSampleMealPlan } = useMealPlanStore();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [importingPlan, setImportingPlan] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ checked: false, ok: false, message: '' });
  const videoRef = useRef<HTMLVideoElement>(null);
  const premiumPlansRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('MealPlans component mounted');
    fetchMealPlans();
  }, []);

  useEffect(() => {
    console.log('Auth state:', { user });
    console.log('Meal plans state:', { mealPlans, loading, error });
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
      await importSampleMealPlan();
    } finally {
      setImportingPlan(false);
    }
  };

  const scrollToPremiumPlans = () => {
    if (premiumPlansRef.current) {
      premiumPlansRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
                    Watch: My Approach to Nutrition
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
                    counting carbs or following restrictive diets. My plans are about nourishing 
                    your body with real food that makes you feel good."
                  </p>
                  <p className="text-primary mt-4 text-lg font-medium">— Chloe</p>
                </div>
                
                <div className="mt-10">
                  <button 
                    onClick={scrollToPremiumPlans}
                    className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/20 group"
                  >
                    View Premium Plans
                    <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Features Section */}
      <div id="nutrition-philosophy" className="bg-white py-24 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-4xl mb-16 text-center">My Nutrition Philosophy</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-6 hover:shadow-lg transition-shadow duration-300 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Utensils className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-playfair text-2xl mb-4">Balanced Nutrition</h3>
              <p className="text-gray-600 leading-relaxed">
                My approach focuses on nourishing your body with whole, nutrient-dense foods 
                that fuel your workouts and support your overall health goals.
              </p>
            </div>
            
            <div className="text-center p-6 hover:shadow-lg transition-shadow duration-300 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-playfair text-2xl mb-4">Sustainable Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn how to create lasting habits that will help you maintain your results 
                long-term, while still enjoying the foods you love.
              </p>
            </div>
            
            <div className="text-center p-6 hover:shadow-lg transition-shadow duration-300 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Lock className="w-8 h-8 text-primary" />
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

      {/* Premium Plans Section */}
      <div id="premium-plans" ref={premiumPlansRef} className="bg-gray-50 py-24 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl mb-6">Premium Meal Plans</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully crafted meal plans designed to help you reach your goals while enjoying delicious, nutritious food.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading meal plans...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : !user ? (
            <div className="max-w-md mx-auto bg-white rounded-lg p-8">
              <h3 className="font-playfair text-2xl mb-2 text-center">Access Meal Plans</h3>
              <p className="text-gray-600 mb-6 text-center">
                Sign in to view your premium content
              </p>
              <div className="hide-signup">
                <div className="max-w-full">
                  <Auth />
                </div>
              </div>
            </div>
          ) : mealPlans.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg p-8 max-w-md mx-auto">
              <p className="text-xl mb-4">No meal plans available</p>
              <p className="text-gray-600 mb-6">
                It seems we couldn't find any meal plans. You can import a sample meal plan or check back later.
              </p>
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => fetchMealPlans()}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Refresh <ArrowRight size={18} className="rotate-90" />
                </button>
                <button 
                  onClick={handleImportSample}
                  disabled={importingPlan}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {importingPlan ? 'Importing...' : 'Import Sample'} 
                  {!importingPlan && <ArrowRight size={18} />}
                </button>
              </div>
              
              {connectionStatus.checked && (
                <div className={`p-3 mb-4 rounded ${connectionStatus.ok ? 'bg-green-100' : 'bg-red-100'}`}>
                  <p className={`text-sm ${connectionStatus.ok ? 'text-green-700' : 'text-red-700'}`}>
                    {connectionStatus.message}
                  </p>
                </div>
              )}
              <button 
                onClick={testConnection}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors mb-4"
              >
                Test Database Connection
              </button>
              <div className="mt-4 text-sm text-gray-500">Debug info: {JSON.stringify({userExists: !!user, mealPlansCount: mealPlans.length})}</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mealPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="p-8">
                    <h3 className="font-playfair text-2xl mb-4">{plan.title}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">What's Included:</h4>
                        <ul className="space-y-2">
                          {plan.content && plan.content.weeks && plan.content.weeks[0] && 
                           plan.content.weeks[0].days && plan.content.weeks[0].days[0] && 
                           plan.content.weeks[0].days[0].meals ? (
                            plan.content.weeks[0].days[0].meals.map((meal, idx) => (
                              <li key={`${meal.name}-${idx}`} className="flex items-start">
                                <Utensils className="w-5 h-5 text-primary mr-3 mt-0.5" />
                                <span>{meal.name}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500">Meal details loading...</li>
                          )}
                        </ul>
                      </div>
                      <div className="pt-6 border-t">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-playfair">R{plan.price}</div>
                          <div className="text-sm text-gray-500">One-time purchase</div>
                        </div>
                        <button className="w-full btn-primary flex items-center justify-center gap-2">
                          Get Started <ArrowRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RecipeModal
        isOpen={selectedRecipe !== null}
        onClose={() => setSelectedRecipe(null)}
        recipe={selectedRecipe}
      />
    </div>
  );
};

export default MealPlans;
