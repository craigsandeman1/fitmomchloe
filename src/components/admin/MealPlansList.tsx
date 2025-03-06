import { Edit, Trash2, FileDown, Eye, EyeOff } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { MealPlan } from '../../types/meal-plan';

// Helper function to get meal plan thumbnail, same as in MealPlans.tsx
const getMealPlanThumbnail = (plan: MealPlan): string | null => {
  // Try different possible property names for thumbnail
  if ((plan as any).thumbnail_url) {
    return (plan as any).thumbnail_url;
  }
  
  // If plan has image_url, use that
  if ((plan as any).image_url) {
    return (plan as any).image_url;
  }
  
  // Check if the content might have the image in metadata
  if (plan.content && (plan.content as any).metadata && (plan.content as any).metadata.thumbnailUrl) {
    console.log('Admin found thumbnail in content.metadata:', (plan.content as any).metadata.thumbnailUrl);
    return (plan.content as any).metadata.thumbnailUrl;
  }
  
  // Check other possible locations
  if (plan.content) {
    // Check directly on content
    if ((plan.content as any).image) {
      return (plan.content as any).image;
    }
  }
  
  return null;
};

// Helper function to check if a meal plan is hidden
const isMealPlanHidden = (plan: MealPlan): boolean => {
  // Check for is_hidden property directly (for UI state)
  if (typeof (plan as any).is_hidden === 'boolean') {
    return (plan as any).is_hidden;
  }
  
  // Check in content.metadata.isHidden (for database storage)
  if (plan.content && 
      (plan.content as any).metadata && 
      typeof (plan.content as any).metadata.isHidden === 'boolean') {
    return (plan.content as any).metadata.isHidden;
  }
  
  return false; // Default to visible
};

interface MealPlansListProps {
  mealPlans: MealPlan[];
  onEdit: (mealPlan: MealPlan) => void;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string, isHidden: boolean) => void;
}

const MealPlansList = ({ mealPlans, onEdit, onDelete, onToggleVisibility }: MealPlansListProps) => {
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
    // If there's a PDF URL available, open it in a new tab
    if ((mealPlan as any).pdf_url) {
      window.open((mealPlan as any).pdf_url, '_blank');
      return;
    }
    
    // Otherwise, generate one on the fly
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

  // Handle visibility toggle
  const handleToggleVisibility = (mealPlan: MealPlan) => {
    if (!mealPlan.id || !onToggleVisibility) return;
    
    // Toggle the current visibility state
    const currentlyHidden = isMealPlanHidden(mealPlan);
    onToggleVisibility(mealPlan.id, !currentlyHidden);
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
              Thumbnail
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
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mealPlans.map((mealPlan) => {
            const isHidden = isMealPlanHidden(mealPlan);
            return (
              <tr key={mealPlan.id} className={isHidden ? "bg-gray-50" : ""}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{mealPlan.title}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {/* Use the helper function to get the thumbnail */}
                  {getMealPlanThumbnail(mealPlan) ? (
                    <img 
                      src={getMealPlanThumbnail(mealPlan) || ''} 
                      alt={`${mealPlan.title} thumbnail`} 
                      className="h-12 w-20 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
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
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm ${isHidden ? "text-red-500" : "text-green-500"}`}>
                    {isHidden ? "Hidden" : "Visible"}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onToggleVisibility && (
                    <button
                      onClick={() => handleToggleVisibility(mealPlan)}
                      className={`${isHidden ? "text-gray-500" : "text-green-500"} hover:text-gray-700 mr-3`}
                      title={isHidden ? "Show meal plan" : "Hide meal plan"}
                    >
                      {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  )}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MealPlansList;
