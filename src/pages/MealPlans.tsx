import { useEffect, useState } from 'react';
import { useMealPlanStore } from '../store/mealPlan';
import { useAuthStore } from '../store/auth';
import { Lock, ArrowRight, Utensils, Clock, ChevronRight } from 'lucide-react';
import { Auth } from '../components/Auth';
import RecipeModal from '../components/RecipeModal';

const FreeSampleMeals = [
  {
    title: "High-Protein Breakfast",
    type: "breakfast" as const,
    meal: {
      name: "Tofu Scramble",
      type: "breakfast" as const,
      ingredients: ["Tofu", "Spinach", "Nutritional yeast", "Whole grain toast"],
      instructions: [
        "Press and crumble the tofu into bite-sized pieces",
        "Sauté spinach in a pan until wilted",
        "Add tofu and nutritional yeast, cook until heated through",
        "Season with salt and pepper to taste",
        "Serve hot with whole grain toast"
      ],
      nutritionalInfo: {
        calories: 400,
        protein: 25,
        carbs: 40,
        fats: 18
      }
    }
  },
  {
    title: "Energy-Packed Lunch",
    type: "lunch" as const,
    meal: {
      name: "Quinoa Buddha Bowl",
      type: "lunch" as const,
      ingredients: ["Quinoa", "Chickpeas", "Avocado", "Tahini dressing"],
      instructions: [
        "Cook quinoa according to package instructions",
        "Season and roast chickpeas until crispy",
        "Slice fresh avocado",
        "Prepare tahini dressing",
        "Assemble bowl with quinoa base, topped with chickpeas and avocado",
        "Drizzle with tahini dressing"
      ],
      nutritionalInfo: {
        calories: 450,
        protein: 20,
        carbs: 55,
        fats: 22
      }
    }
  },
  {
    title: "Lean Dinner",
    type: "dinner" as const,
    meal: {
      name: "Lentil Shepherd's Pie",
      type: "dinner" as const,
      ingredients: ["Lentils", "Mashed potatoes", "Mixed vegetables", "Herbs"],
      instructions: [
        "Cook lentils until tender",
        "Prepare mashed potatoes with minimal butter",
        "Sauté mixed vegetables with herbs",
        "Layer lentils and vegetables in a baking dish",
        "Top with mashed potatoes",
        "Bake until golden brown on top"
      ],
      nutritionalInfo: {
        calories: 500,
        protein: 22,
        carbs: 70,
        fats: 15
      }
    }
  }
];

const MealPlans = () => {
  const { user } = useAuthStore();
  const { mealPlans, loading, error, fetchMealPlans, selectedPlan, setSelectedPlan } = useMealPlanStore();
  const [selectedRecipe, setSelectedRecipe] = useState<typeof FreeSampleMeals[0] | null>(null);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  // Hero Section - Visible to all users
  const MealPlansHero = () => (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Healthy food background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
      </div>

      <div className="relative z-10 section-container py-32">
        <h1 className="font-playfair text-5xl md:text-6xl mb-6 text-center text-white">
          Transform Your <span className="text-primary">Nutrition</span>
        </h1>
        <p className="text-xl text-white/90 text-center max-w-2xl mx-auto mb-16">
          Start your journey with these free healthy recipes, designed by professional nutritionists to give you a taste of our premium meal plans.
        </p>

        {/* Free Sample Meals Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {FreeSampleMeals.map((sample, index) => (
            <div 
              key={index}
              className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Utensils className="text-primary" size={24} />
                  <h3 className="font-playfair text-xl">{sample.title}</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-primary mb-2">{sample.meal.name}</h4>
                  <div className="text-sm text-gray-600">
                    <strong>Ingredients:</strong>
                    <p>{sample.meal.ingredients.join(", ")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(sample.meal.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="bg-white/80 p-2 rounded-lg text-center">
                      <div className="text-xs text-gray-500 capitalize">{key}</div>
                      <div className="font-medium">{value}{key === 'calories' ? 'kcal' : 'g'}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setSelectedRecipe(sample)}
                    className="text-primary flex items-center gap-1 text-sm hover:gap-2 transition-all group-hover:text-primary/80"
                  >
                    View Full Recipe <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-white/90 mb-6 text-lg">
            Get access to our complete library of premium meal plans
          </p>
          {!user ? (
            <button 
              onClick={() => {/* Implement trial signup */}}
              className="btn-primary px-8 py-3 text-lg hover:scale-105 transition-transform"
            >
              Start Your Free Trial
            </button>
          ) : (
            <button 
              onClick={() => {
                const element = document.getElementById('premium-plans');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary px-8 py-3 text-lg hover:scale-105 transition-transform"
            >
              View Premium Plans
            </button>
          )}
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={selectedRecipe !== null}
        onClose={() => setSelectedRecipe(null)}
        recipe={selectedRecipe}
      />
    </div>
  );

  if (loading) {
    return (
      <div>
        <MealPlansHero />
        <div className="section-container py-20">
          <div className="text-center">
            <p>Loading meal plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <MealPlansHero />
        <div className="section-container py-20">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <MealPlansHero />
        <div className="section-container py-20">
          <h1 className="font-playfair text-4xl mb-8 text-center">Access Premium Meal Plans</h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in or create an account to access our premium meal plans.
          </p>
          <div className="max-w-md mx-auto">
            <Auth />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MealPlansHero />
      
      {/* Chloe's Approach Section */}
      <div className="bg-background py-20">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-playfair text-4xl mb-6">My Approach to Nutrition</h2>
              <p className="text-lg mb-6">
                I believe in a balanced approach to nutrition that doesn't involve obsessively counting carbs or following restrictive diets.
              </p>
              <p className="text-lg mb-6">
                My meal plans are designed to nourish your body with whole, nutrient-dense foods that fuel your workouts and support your overall health goals.
              </p>
              <p className="text-lg mb-6">
                Instead of focusing on what you can't eat, I'll show you how to create delicious, satisfying meals that support your fitness journey while still enjoying the foods you love.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <div className="h-1 w-12 bg-primary"></div>
                <p className="font-medium text-primary">Chloe, Fitness & Nutrition Coach</p>
              </div>
            </div>
            <div className="order-1 md:order-2 mx-auto md:mx-0">
              <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-xl overflow-hidden shadow-xl">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src={new URL('../assets/videos/meal-plans.mp4', import.meta.url).href} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium Meal Plans Section */}
      <div id="premium-plans" className="section-container py-20">
        <h2 className="font-playfair text-4xl mb-12 text-center">Premium Meal Plans</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mealPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="font-playfair text-2xl mb-3">{plan.title}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                {/* Preview of first week's meals */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Sample meals from Week 1:</h4>
                  <ul className="space-y-2">
                    {plan.content.weeks[0].days[0].meals.map((meal) => (
                      <li key={meal.name} className="flex items-start">
                        <span className="w-24 text-sm text-gray-500">{meal.type}:</span>
                        <span className="flex-1 text-sm">{meal.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutritional highlights */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Daily Nutritional Targets:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(plan.content.weeks[0].days[0].meals[0].nutritionalInfo).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 capitalize">{key}</div>
                        <div className="font-medium">{value}{key === 'calories' ? 'kcal' : 'g'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-playfair">R{plan.price}</div>
                    <div className="text-sm text-gray-500">One-time purchase</div>
                  </div>
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    Get Started
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mealPlans.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No meal plans available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlans;
