import { Edit2, Trash2 } from 'lucide-react';
import { MealPlan } from '../../types/meal-plan';

interface MealPlansListProps {
  mealPlans: MealPlan[];
  onEdit: (plan: MealPlan) => void;
  onDelete: (id: string) => void;
}

const MealPlansList = ({ mealPlans, onEdit, onDelete }: MealPlansListProps) => {
  return (
    <div className="space-y-4">
      {mealPlans.map((plan) => (
        <div key={plan.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
              <p className="text-gray-600 mb-2">{plan.description}</p>
              <div className="space-y-2">
                <p className="text-lg font-medium">R {plan.price.toFixed(2)}</p>
                {plan.dietary_type && (
                  <p className="text-sm text-gray-600">Type: {plan.dietary_type}</p>
                )}
                {plan.difficulty_level && (
                  <p className="text-sm text-gray-600">Level: {plan.difficulty_level}</p>
                )}
                {plan.duration_weeks && (
                  <p className="text-sm text-gray-600">Duration: {plan.duration_weeks} weeks</p>
                )}
                {(plan.total_calories || plan.total_protein || plan.total_carbs || plan.total_fat) && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Nutritional Information (per day):</p>
                    <ul className="list-disc list-inside">
                      {plan.total_calories && <li>Calories: {plan.total_calories}</li>}
                      {plan.total_protein && <li>Protein: {plan.total_protein}g</li>}
                      {plan.total_carbs && <li>Carbs: {plan.total_carbs}g</li>}
                      {plan.total_fat && <li>Fat: {plan.total_fat}g</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(plan)}
                className="p-2 text-gray-600 hover:text-primary"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(plan.id)}
                className="p-2 text-gray-600 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {mealPlans.length === 0 && (
        <p className="text-center text-gray-500">No meal plans found</p>
      )}
    </div>
  );
};

export default MealPlansList;