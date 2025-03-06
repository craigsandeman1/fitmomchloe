import { useState } from 'react';
import { generateMealPlanPDF, savePDF } from '../lib/meal-plan-generator';

const MealPlanGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Sample meal plan data structure that matches our template
  const weightLossMealPlan = {
    title: '7-DAY WEIGHT LOSS MEAL PLAN',
    subtitle: 'A complete guide to transform your nutrition journey',
    author: 'Created by Chloe',
    introduction: `
      <p>This meal plan is designed for intermittent fasting (no breakfast) with 2 meals per day OR a breakfast option with 3 meals per day. The plan focuses on nutrient-dense whole foods that support healthy weight loss while providing energy and satisfaction.</p>
      <p>You may drink tea and coffee (preferably black) during the fasting window, and plenty of water. If choosing the breakfast option, acceptable breakfasts can be found in the appendix.</p>
      <p>Start each day with a cup of warm water with a tablespoon of apple cider vinegar, fresh lemon juice, and a dash of cayenne pepper and turmeric for metabolism support.</p>
    `,
    days: [
      {
        day: '1',
        meals: [
          {
            title: 'LUNCH: Tuna and Egg Salad',
            ingredients: [
              '1 tin tuna in brine (drained)',
              '2 boiled eggs',
              'Mixed salad leaves of choice',
              'Half an avocado',
              'Half a ring of feta',
              'Handful cherry tomatoes',
              'Sliced onion (optional)',
              'Olive oil',
              'Fresh lemon juice',
              'Herb salt',
              'Cayenne pepper (optional, for extra fat burning effect)'
            ]
          },
          {
            title: 'SNACK ONE (Around 3pm)',
            description: 'Choose from the acceptable snacks list in the appendix.'
          },
          {
            title: 'DINNER: Roast Chicken Pieces with Roast Veg',
            instructions: 'Roast chicken pieces and vegetables in a roasting pan with some olive oil and fresh herbs, salt and pepper. Add chili or cayenne pepper for extra \'fat burning\' effect.',
            ingredients: [
              'Max 3 pieces (depending on size) of roast chicken',
              'Low carb vegetables (no potatoes, sweet potato, butternut, etc.)',
              'Half an avocado (optional)',
              'Olive oil',
              'Fresh herbs',
              'Salt and pepper',
              'Chili or cayenne pepper (optional)'
            ]
          },
          {
            title: 'SNACK TWO (Before 8pm)',
            description: 'Choose from the acceptable snacks list in the appendix.'
          }
        ]
      }
      // Additional days would be added here in the same format
    ],
    appendix: {
      snacksTitle: 'LIST OF ACCEPTABLE SNACKS',
      snacks: [
        'Handful of dried fruit',
        'Handful of mixed nuts',
        '1 large piece of fruit',
        'Half an avocado with herb salt',
        'Handful of biltong slices',
        'Small bowl of popcorn seasoned with herb salt',
        'Small fruit salad with plain Greek yoghurt',
        'Boiled Egg'
      ],
      supplementsTitle: 'SUPPLEMENTS FOR BLOATING AND WEIGHT LOSS',
      supplements: [
        'Berberine twice a day, 15 minutes before meals',
        'Curcumin one to two times a day with meals',
        'L Carnitine before workouts',
        'Probiotics 1-2 times per day',
        'Digestive Enzymes with meals'
      ],
      breakfastsTitle: 'OPTIONAL BREAKFAST IDEAS',
      breakfasts: [
        '2 boiled eggs drizzled in olive oil and seasoned with herb salt (add cayenne pepper for extra fat burning effect)',
        'Cup of mixed berries and nuts with Greek yoghurt',
        'Bowl of plain fruit',
        'Gluten free seed crackers with avocado and 2 scrambled eggs'
      ],
      reminder: 'REMEMBER TO DRINK WATER!!!\nHerbal teas such as green tea, dandelion and peppermint tea are also fantastic.\nPhyto-Cleanse detox tea on the days your tummy is feeling bloated and sluggish. 1 cup at night.'
    }
  };
  
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      const pdfBlob = await generateMealPlanPDF(weightLossMealPlan);
      savePDF(pdfBlob, 'weight-loss-meal-plan.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate the PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-playfair text-2xl mb-4">Meal Plan PDF Generator</h2>
      <p className="mb-4 text-gray-600">
        Generate a beautifully designed meal plan PDF that matches your brand's style and is ready to be sold.
      </p>
      <button
        onClick={handleGeneratePDF}
        disabled={isGenerating}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isGenerating ? 'Generating PDF...' : 'Generate Sample PDF'}
      </button>
      <div className="mt-4 text-sm text-gray-500">
        Note: The generator uses your browser to create the PDF. The first generation might take a few seconds.
      </div>
    </div>
  );
};

export default MealPlanGenerator;