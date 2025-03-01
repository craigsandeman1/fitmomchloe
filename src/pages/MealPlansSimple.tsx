import React from 'react';
import SEO from '../components/SEO';

const MealPlansSimple = () => {
  return (
    <div className="container mx-auto p-8">
      <SEO 
        title="Simple Meal Plans for Busy Moms | Quick & Healthy Recipes | Fit Mom Chloe" 
        description="No-fuss, easy-to-follow meal plans designed for busy moms who don't have time to count calories. What if eating healthy could actually be simple?" 
        canonicalUrl="/meal-plans-simple"
      />
      <h1 className="text-3xl font-bold mb-6">Meal Plans</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Approach to Nutrition</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <p className="mb-4">
              I believe in a balanced approach to nutrition that doesn't involve obsessively counting carbs or following restrictive diets.
            </p>
            <p className="mb-4">
              My meal plans are designed to nourish your body with whole, nutrient-dense foods that fuel your workouts and support your overall health goals.
            </p>
            <p className="mb-4">
              Instead of focusing on what you can't eat, I'll show you how to create delicious, satisfying meals that support your fitness journey while still enjoying the foods you love.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="aspect-[9/16] max-w-[300px] mx-auto overflow-hidden rounded-lg shadow-lg">
              <video 
                controls 
                className="w-full h-full object-cover"
              >
                <source src="/meal-plans.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <a href="/meal-plans" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Back to Main Meal Plans
        </a>
      </div>
    </div>
  );
};

export default MealPlansSimple;
