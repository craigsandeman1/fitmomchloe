import { AlertCircle } from 'lucide-react';
import { MealPlan } from '../../types/meal-plan';

interface MealPlanFormProps {
  editingMealPlan: MealPlan | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
}

const DIETARY_TYPES = [
  'Standard',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Low-Carb',
  'Gluten-Free',
  'Dairy-Free',
];

const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

const MealPlanForm = ({ editingMealPlan, onSubmit, onCancel }: MealPlanFormProps) => {
  return (
    <div className="mb-8 p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">
        {editingMealPlan?.id ? 'Edit' : 'Create'} Meal Plan
      </h3>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              defaultValue={editingMealPlan?.title}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (ZAR) *
            </label>
            <input
              type="number"
              name="price"
              defaultValue={editingMealPlan?.price}
              step="0.01"
              min="0"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            defaultValue={editingMealPlan?.description}
            className="w-full p-2 border rounded-md"
            rows={3}
            required
          />
        </div>

        {/* Plan Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dietary Type
            </label>
            <select
              name="dietary_type"
              defaultValue={editingMealPlan?.dietary_type}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Type</option>
              {DIETARY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              name="difficulty_level"
              defaultValue={editingMealPlan?.difficulty_level}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Level</option>
              {DIFFICULTY_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (weeks)
            </label>
            <input
              type="number"
              name="duration_weeks"
              defaultValue={editingMealPlan?.duration_weeks}
              min="1"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Nutritional Information */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <AlertCircle size={16} className="mr-2" />
            Nutritional Information (Optional)
          </h4>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Calories
              </label>
              <input
                type="number"
                name="total_calories"
                defaultValue={editingMealPlan?.total_calories}
                min="0"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Protein (g)
              </label>
              <input
                type="number"
                name="total_protein"
                defaultValue={editingMealPlan?.total_protein}
                min="0"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Carbs (g)
              </label>
              <input
                type="number"
                name="total_carbs"
                defaultValue={editingMealPlan?.total_carbs}
                min="0"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Fat (g)
              </label>
              <input
                type="number"
                name="total_fat"
                defaultValue={editingMealPlan?.total_fat}
                min="0"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 mb-2">Additional Features</h4>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="includes_grocery_list"
                value="true"
                defaultChecked={editingMealPlan?.includes_grocery_list}
                className="mr-2"
              />
              Includes Grocery List
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="includes_recipes"
                value="true"
                defaultChecked={editingMealPlan?.includes_recipes}
                className="mr-2"
              />
              Includes Detailed Recipes
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default MealPlanForm;