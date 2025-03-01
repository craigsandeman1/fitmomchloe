import { Edit, Trash2 } from 'lucide-react';
import { MealPlan } from '../../types/meal-plan';

interface MealPlansListProps {
  mealPlans: MealPlan[];
  onEdit: (mealPlan: MealPlan) => void;
  onDelete: (id: string) => void;
}

const MealPlansList = ({ mealPlans, onEdit, onDelete }: MealPlansListProps) => {
  if (mealPlans.length === 0) {
    return <p className="text-gray-500 italic">No meal plans found.</p>;
  }

  // Ensure we handle the ID correctly
  const handleEdit = (mealPlan: MealPlan) => {
    // Validate the ID is present and not empty
    if (!mealPlan.id || mealPlan.id.trim() === '') {
      console.error('Attempted to edit a meal plan with an invalid ID');
      return;
    }
    onEdit(mealPlan);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mealPlans.map((mealPlan) => (
            <tr key={mealPlan.id}>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{mealPlan.title}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">R{mealPlan.price.toFixed(2)}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{mealPlan.dietary_type || 'Standard'}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{mealPlan.duration_weeks || '-'} weeks</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleEdit(mealPlan)}
                  className="text-primary hover:text-primary-dark mr-3"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(mealPlan.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealPlansList;