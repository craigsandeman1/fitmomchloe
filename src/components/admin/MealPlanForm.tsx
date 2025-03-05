import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { MealPlan } from '../../types/meal-plan';

interface MealPlanFormProps {
  editingMealPlan: MealPlan;
  onSubmit: (mealPlan: MealPlan) => Promise<void>;
  onCancel: () => void;
}

const MealPlanForm = ({ editingMealPlan, onSubmit, onCancel }: MealPlanFormProps) => {
  const [mealPlan, setMealPlan] = useState<MealPlan>(editingMealPlan);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMealPlan(editingMealPlan);
  }, [editingMealPlan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setMealPlan({ ...mealPlan, [name]: checked });
      return;
    }
    
    // Handle numeric fields
    if (name === 'price' || name === 'duration_weeks' || name === 'total_calories' || 
        name === 'total_protein' || name === 'total_carbs' || name === 'total_fat') {
      const numValue = value === '' ? 0 : Number(value);
      setMealPlan({ ...mealPlan, [name]: numValue });
      return;
    }
    
    // Handle all other fields
    setMealPlan({ ...mealPlan, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate required fields
      if (!mealPlan.title.trim()) {
        throw new Error('Title is required');
      }
      
      await onSubmit(mealPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          {mealPlan.id ? 'Edit Meal Plan' : 'Create New Meal Plan'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title*
            </label>
            <input
              type="text"
              name="title"
              value={mealPlan.title || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (R)*
            </label>
            <input
              type="number"
              name="price"
              value={mealPlan.price || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            name="description"
            value={mealPlan.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dietary Type
            </label>
            <select
              name="dietary_type"
              value={mealPlan.dietary_type || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            >
              <option value="">Select Type</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="gluten-free">Gluten-Free</option>
              <option value="dairy-free">Dairy-Free</option>
              <option value="balanced">Balanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              name="difficulty_level"
              value={mealPlan.difficulty_level || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
            >
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Weeks)
            </label>
            <input
              type="number"
              name="duration_weeks"
              value={mealPlan.duration_weeks || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              min="1"
              max="12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Calories
            </label>
            <input
              type="number"
              name="total_calories"
              value={mealPlan.total_calories || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Protein (g)
            </label>
            <input
              type="number"
              name="total_protein"
              value={mealPlan.total_protein || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Carbs (g)
            </label>
            <input
              type="number"
              name="total_carbs"
              value={mealPlan.total_carbs || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Fat (g)
            </label>
            <input
              type="number"
              name="total_fat"
              value={mealPlan.total_fat || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center mb-6 space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includes_grocery_list"
              name="includes_grocery_list"
              checked={mealPlan.includes_grocery_list || false}
              onChange={(e) => setMealPlan({ ...mealPlan, includes_grocery_list: e.target.checked })}
              className="h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="includes_grocery_list" className="ml-2 text-sm text-gray-700">
              Includes Grocery List
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includes_recipes"
              name="includes_recipes"
              checked={mealPlan.includes_recipes || false}
              onChange={(e) => setMealPlan({ ...mealPlan, includes_recipes: e.target.checked })}
              className="h-4 w-4 text-primary focus:ring-primary"
            />
            <label htmlFor="includes_recipes" className="ml-2 text-sm text-gray-700">
              Includes Recipes
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (mealPlan.id ? 'Update Plan' : 'Create Plan')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MealPlanForm;