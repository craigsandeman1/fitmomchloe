import { Edit, Trash2, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
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
  
  // Handle delete with proper type checking
  const handleDelete = (id: string | null) => {
    if (!id) {
      console.error('Attempted to delete a meal plan with an invalid ID');
      return;
    }
    onDelete(id);
  };
  
  // Generate and download PDF for a meal plan
  const handleDownloadPDF = (mealPlan: MealPlan) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Meal Plan: ${mealPlan.title}`, 20, 20);
    
    // Add description
    doc.setFontSize(12);
    doc.text('Description:', 20, 30);
    
    // Handle long descriptions by wrapping text
    const splitDescription = doc.splitTextToSize(mealPlan.description, 170);
    doc.text(splitDescription, 20, 40);
    
    let yPosition = 40 + (splitDescription.length * 7);
    
    // Add details
    doc.setFontSize(14);
    doc.text('Details:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text(`Price: R${mealPlan.price.toFixed(2)}`, 20, yPosition);
    yPosition += 7;
    
    if (mealPlan.dietary_type) {
      doc.text(`Dietary Type: ${mealPlan.dietary_type}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (mealPlan.duration_weeks) {
      doc.text(`Duration: ${mealPlan.duration_weeks} weeks`, 20, yPosition);
      yPosition += 7;
    }
    
    if (mealPlan.total_calories) {
      doc.text(`Total Calories: ${mealPlan.total_calories}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (mealPlan.total_protein) {
      doc.text(`Total Protein: ${mealPlan.total_protein}g`, 20, yPosition);
      yPosition += 7;
    }
    
    if (mealPlan.total_carbs) {
      doc.text(`Total Carbs: ${mealPlan.total_carbs}g`, 20, yPosition);
      yPosition += 7;
    }
    
    if (mealPlan.total_fat) {
      doc.text(`Total Fat: ${mealPlan.total_fat}g`, 20, yPosition);
      yPosition += 7;
    }
    
    // Add meal plan content if available
    if (mealPlan.content && mealPlan.content.weeks && mealPlan.content.weeks.length > 0) {
      yPosition += 10;
      doc.setFontSize(14);
      doc.text('Meal Plan Content:', 20, yPosition);
      yPosition += 10;
      
      mealPlan.content.weeks.forEach((week, weekIndex) => {
        doc.setFontSize(13);
        doc.text(`Week ${week.weekNumber}:`, 20, yPosition);
        yPosition += 7;
        
        week.days.forEach((day, dayIndex) => {
          // Check if we need a new page
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(12);
          doc.text(`${day.day}:`, 25, yPosition);
          yPosition += 7;
          
          day.meals.forEach((meal, mealIndex) => {
            // Check if we need a new page
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.setFontSize(11);
            doc.text(`${meal.type}: ${meal.name}`, 30, yPosition);
            yPosition += 7;
          });
        });
      });
    }
    
    // Add footer with date
    const today = new Date();
    doc.setFontSize(10);
    doc.text(`Generated on ${today.toLocaleDateString()}`, 20, 290);
    
    // Save the PDF
    doc.save(`${mealPlan.title.replace(/\s+/g, '_')}_meal_plan.pdf`);
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
                  onClick={() => handleDownloadPDF(mealPlan)}
                  className="text-blue-500 hover:text-blue-700 mr-3"
                  title="Download PDF"
                >
                  <FileDown size={16} />
                </button>
                <button
                  onClick={() => handleEdit(mealPlan)}
                  className="text-primary hover:text-primary-dark mr-3"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(mealPlan.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
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
