import { useEffect, useState, useRef } from 'react';
import { useMealPlanStore } from '../store/mealPlan';
import { useAuthStore } from '../store/auth';
import { ArrowRight, Utensils, ChevronRight } from 'lucide-react';
import { Auth } from '../components/Auth';
import RecipeModal from '../components/RecipeModal';
import { supabase } from '../lib/supabase';
import type { MealPlan } from '../types';
import { MD5 } from 'crypto-js';

// Start FreeSampleMeals here, removing the interface and function

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
  const { mealPlans, loading, error, fetchMealPlans } = useMealPlanStore();
  const [selectedRecipe, setSelectedRecipe] = useState<typeof FreeSampleMeals[0] | null>(null);
  const [processingPurchase, setProcessingPurchase] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const handlePurchase = async (plan: MealPlan, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!user.email) {
        throw new Error('User email not set');
      }

      if (!plan.id || !plan.price) {
        console.error('Invalid plan data:', plan);
        throw new Error('Invalid meal plan data');
      }

      setProcessingPurchase(true);

      // Create purchase record
      const purchaseData = {
        user_id: user.id,
        meal_plan_id: plan.id,
        amount: plan.price,
        email: user.email,
        status: 'pending'
      };

      console.log('Creating purchase with data:', purchaseData);

      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert([purchaseData])
        .select()
        .single();

      if (purchaseError) {
        console.error('Supabase error:', purchaseError);
        throw new Error(`Database error: ${purchaseError.message}`);
      }

      if (!purchase) {
        throw new Error('No purchase record created');
      }

      // Create form directly with raw values (no interface or complex objects)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payfast.co.za/eng/process';
      form.acceptCharset = 'UTF-8';
      form.style.display = 'none';
      
      // Prepare payment data with simple object
      const formFields = {
        // Merchant details - EXACTLY as provided in test credentials
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        
        // URLs - use environment-aware URLs
        return_url: `${window.location.origin}/payment/success?custom_str1=${purchase.id}`,
        cancel_url: `${window.location.origin}/payment/cancelled`,
        // Use production URL in production, local in development
        notify_url: process.env.NODE_ENV === 'production' 
          ? `${window.location.origin}/api/payfast/notify` 
          : 'https://webhook.site/your-webhook-id', // Visit webhook.site to get a unique URL
        
        // Transaction details - ensure amount is formatted with 2 decimal places
        amount: plan.price.toFixed(2),
        item_name: plan.title.substring(0, 100),
        
        // Custom fields for tracking
        m_payment_id: purchase.id,
        custom_str1: purchase.id,
        
        // Customer details (using test data)
        name_first: 'Test',
        name_last: 'User',
        email_address: 'sbtu01@payfast.co.za',
        cell_number: '0833456789',
        payment_method: 'cc'
      };

      // Build parameter string directly
      let paramString = '';
      const keys = Object.keys(formFields).sort();
      
      for (const key of keys) {
        const value = formFields[key as keyof typeof formFields];
        if (value) {
          // No additional encoding in the parameter string - raw values
          paramString += `${key}=${value}&`;
        }
      }
      
      // Remove trailing &
      paramString = paramString.slice(0, -1);
      
      // Add passphrase
      const passPhrase = 'jt7NOE43FZPn';
      const stringToHash = `${paramString}&passphrase=${passPhrase}`;
      
      console.log('Raw string to hash:', stringToHash);
      
      // Generate MD5 hash
      const signature = MD5(stringToHash).toString();
      console.log('PayFast Signature:', signature);
      
      // Add all fields to form
      for (const [key, value] of Object.entries(formFields)) {
        if (value) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      }
      
      // Add signature
      const signatureInput = document.createElement('input');
      signatureInput.type = 'hidden';
      signatureInput.name = 'signature';
      signatureInput.value = signature;
      form.appendChild(signatureInput);
      
      console.log('Form fields for purchase:', formFields);
      
      // Append form to document and submit
      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error('Purchase error:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}. Please try again or contact support.`);
      } else {
        alert('An unexpected error occurred. Please try again or contact support.');
      }
      setProcessingPurchase(false);
    }
  };

  // Replace the createTestPayment function with this simplified version
  const createTestPayment = () => {
    try {
      // Create a simplified form directly with minimal processing
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payfast.co.za/eng/process';
      form.acceptCharset = 'UTF-8';
      form.style.display = 'none';
      
      // Fixed values directly from PayFast documentation
      const formFields = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        return_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancelled`,
        // Use production URL in production, local in development
        notify_url: process.env.NODE_ENV === 'production' 
          ? `${window.location.origin}/api/payfast/notify` 
          : 'https://webhook.site/your-webhook-id', // Visit webhook.site to get a unique URL
        amount: '100.00',
        item_name: 'Test Item',
        name_first: 'Test',
        name_last: 'User',
        email_address: 'sbtu01@payfast.co.za',
        cell_number: '0833456789',
        payment_method: 'cc'
      };
      
      // Generate the parameter string exactly as PayFast expects
      let paramString = '';
      const keys = Object.keys(formFields).sort();
      
      for (const key of keys) {
        const value = formFields[key as keyof typeof formFields];
        if (value) {
          // No additional encoding, just raw values
          paramString += `${key}=${value}&`;
        }
      }
      
      // Remove trailing &
      paramString = paramString.slice(0, -1);
      
      // Add passphrase exactly as in documentation
      const passPhrase = 'jt7NOE43FZPn';
      const stringToHash = `${paramString}&passphrase=${passPhrase}`;
      
      console.log('Raw string to hash:', stringToHash);
      
      // Generate MD5 hash
      const signature = MD5(stringToHash).toString();
      console.log('PayFast Signature:', signature);
      
      // Add all fields to form including signature
      for (const [key, value] of Object.entries(formFields)) {
        if (value) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      }
      
      // Add signature
      const signatureInput = document.createElement('input');
      signatureInput.type = 'hidden';
      signatureInput.name = 'signature';
      signatureInput.value = signature;
      form.appendChild(signatureInput);
      
      console.log('Form fields for test payment:', formFields);
      console.log('Signature:', signature);
      
      // Append form to document and submit
      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error('Test payment error:', error);
      alert('Error creating test payment. See console for details.');
    }
  };

  // Hero Section - Visible to all users
  const HeroSection = () => (
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
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          {/* Video Section */}
          <div 
            className="relative aspect-[9/16] w-full max-w-[400px] mx-auto md:ml-0 rounded-2xl overflow-hidden shadow-2xl group"
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              controls
              loop
              playsInline
              poster={new URL('../assets/images/meal-plan.jpg', import.meta.url).href}
              onError={(e) => console.error('Video loading error:', e)}
            >
              <source src={new URL('../assets/videos/Meal-Plan.mp4', import.meta.url).href} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Content Section */}
          <div className="text-center md:text-left">
            <h1 className="font-playfair text-5xl md:text-6xl mb-6 text-white">
              Transform Your <span className="text-primary">Nutrition</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto md:mx-0 mb-8">
              Start your journey with these free healthy recipes, designed by professional nutritionists to give you a taste of our premium meal plans.
            </p>
            <p className="text-lg text-white/80 mb-8 italic">
              "I don't believe in calorie counting - I believe in nourishing your body with wholesome, balanced meals that make you feel amazing."
            </p>
          </div>
        </div>

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
        <HeroSection />
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
        <HeroSection />
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
        <HeroSection />
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
      <HeroSection />
      
      {/* Premium Meal Plans Section */}
      <div id="premium-plans" className="section-container py-20">
        <h2 className="font-playfair text-4xl mb-12 text-center">Premium Meal Plans</h2>
        {/* Test Payment Button - Remove in production */}
        <div className="text-center mb-8">
          <button
            onClick={createTestPayment}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Test PayFast Integration
          </button>
          <p className="text-sm text-gray-500 mt-2">
            This button is for testing purposes only and will create a test payment of R100.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mealPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="font-playfair text-2xl mb-3">{plan.title}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                {/* Nutritional highlights */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Daily Nutritional Targets:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {plan.content?.weeks?.[0]?.days?.[0]?.meals?.[0]?.nutritionalInfo ? 
                      Object.entries(plan.content.weeks[0].days[0].meals[0].nutritionalInfo).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 capitalize">{key}</div>
                          <div className="font-medium">{value}{key === 'calories' ? 'kcal' : 'g'}</div>
                        </div>
                      ))
                      :
                      <div className="col-span-2 text-gray-500 text-sm">
                        Nutritional information not available
                      </div>
                    }
                  </div>
                </div>

                {/* Preview of first week's meals */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Sample meals from Week 1:</h4>
                  <ul className="space-y-2">
                    {plan.content?.weeks?.[0]?.days?.[0]?.meals?.map((meal) => (
                      <li key={meal.name} className="flex items-start">
                        <span className="w-24 text-sm text-gray-500">{meal.type}:</span>
                        <span className="flex-1 text-sm">{meal.name}</span>
                      </li>
                    )) || (
                      <li className="text-gray-500 text-sm">No meal information available</li>
                    )}
                  </ul>
                </div>

                {/* Price and CTA */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-playfair">R{plan.price}</div>
                    <div className="text-sm text-gray-500">One-time purchase</div>
                  </div>
                  <form
                    action="https://sandbox.payfast.co.za/eng/process"
                    method="post"
                    className="w-full"
                    onSubmit={(e) => handlePurchase(plan, e)}
                  >
                    {/* PayFast Required Fields */}
                    <input type="hidden" name="merchant_id" value={import.meta.env.VITE_PAYFAST_MERCHANT_ID} />
                    <input type="hidden" name="merchant_key" value={import.meta.env.VITE_PAYFAST_MERCHANT_KEY} />
                    <input type="hidden" name="return_url" value={`${window.location.origin}/payment/success`} />
                    <input type="hidden" name="cancel_url" value={`${window.location.origin}/payment/cancelled`} />
                    <input type="hidden" name="notify_url" value={`${window.location.origin}/api/payfast/notify`} />
                    
                    {/* Transaction Details */}
                    <input type="hidden" name="amount" value={plan.price} />
                    <input type="hidden" name="item_name" value={plan.title} />
                    <input type="hidden" name="item_description" value={plan.description} />
                    
                    {/* Customer Details - will be filled if available */}
                    {user?.email && <input type="hidden" name="email_address" value={user.email} />}
                    
                    <button
                      type="submit"
                      className="w-full btn-primary flex items-center justify-center gap-2"
                      disabled={processingPurchase}
                    >
                      {processingPurchase ? (
                        'Processing...'
                      ) : (
                        <>
                          Purchase Now
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </form>
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