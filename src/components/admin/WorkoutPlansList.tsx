import React from 'react';
import { Pencil, Trash2, Eye, EyeOff, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { WorkoutPlan } from '../../types/workout-plan';
import { getWorkoutPlanThumbnail, formatWorkoutDuration, formatFitnessType, getDifficultyColor, formatCaloriesBurned } from '../../lib/workoutPlanHelpers';

interface WorkoutPlansListProps {
  workoutPlans: WorkoutPlan[];
  onEdit: (workoutPlan: WorkoutPlan) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isHidden: boolean) => void;
}

const WorkoutPlansList: React.FC<WorkoutPlansListProps> = ({
  workoutPlans,
  onEdit,
  onDelete,
  onToggleVisibility,
}) => {
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  const isWorkoutPlanHidden = (plan: WorkoutPlan): boolean => {
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

  const handleDownloadPlan = (plan: WorkoutPlan) => {
    // Check if the plan has a PDF URL (direct property or in metadata)
    const pdfUrl = (plan as any).pdf_url || plan.content?.metadata?.pdfUrl;
    
    if (pdfUrl) {
      console.log('Opening PDF URL:', pdfUrl);
      window.open(pdfUrl, '_blank');
      return;
    }
    
    // Generate PDF on the fly using jsPDF
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Workout Plan: ${plan.title}`, 20, 20);
    
    // Add description
    doc.setFontSize(12);
    doc.text('Description:', 20, 35);
    
    // Handle long descriptions by wrapping text
    const splitDescription = doc.splitTextToSize(plan.description, 170);
    doc.text(splitDescription, 20, 45);
    
    let yPosition = 45 + (splitDescription.length * 7);
    
    // Add workout details
    doc.setFontSize(14);
    doc.text('Workout Details:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text(`Price: R${plan.price.toFixed(2)}`, 20, yPosition);
    yPosition += 7;
    
    if (plan.fitness_type) {
      doc.text(`Fitness Type: ${formatFitnessType(plan.fitness_type)}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (plan.difficulty_level) {
      doc.text(`Difficulty Level: ${plan.difficulty_level}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (plan.workout_duration) {
      doc.text(`Workout Duration: ${formatWorkoutDuration(plan.workout_duration)}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (plan.duration_weeks) {
      doc.text(`Program Duration: ${plan.duration_weeks} ${plan.duration_weeks === 1 ? 'week' : 'weeks'}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (plan.estimated_calories_burned) {
      doc.text(`Estimated Calories Burned: ${formatCaloriesBurned(plan.estimated_calories_burned)}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (plan.target_muscle_groups) {
      doc.text(`Target Muscle Groups: ${plan.target_muscle_groups}`, 20, yPosition);
      yPosition += 7;
    }
    
    // Add equipment and exercise info
    if (plan.includes_equipment_list) {
      doc.text('✓ Includes Equipment List', 20, yPosition);
      yPosition += 7;
    }
    
    if (plan.includes_exercise_descriptions) {
      doc.text('✓ Includes Exercise Descriptions', 20, yPosition);
      yPosition += 7;
    }
    
    // Add workout content if available
    if (plan.content && plan.content.weeks && plan.content.weeks.length > 0) {
      yPosition += 10;
      doc.setFontSize(16);
      doc.text('Workout Program:', 20, yPosition);
      yPosition += 10;
      
      plan.content.weeks.forEach((week, weekIndex) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.text(`Week ${week.weekNumber}`, 20, yPosition);
        yPosition += 10;
        
        week.days.forEach((day, dayIndex) => {
          // Check if we need a new page
          if (yPosition > 260) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(13);
          doc.text(`${day.day}:`, 25, yPosition);
          yPosition += 8;
          
          day.workouts.forEach((workout, workoutIndex) => {
            // Check if we need a new page
            if (yPosition > 260) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.setFontSize(12);
            doc.text(`• ${workout.name}`, 30, yPosition);
            yPosition += 6;
            
            if (workout.type) {
              doc.setFontSize(11);
              doc.text(`  Type: ${workout.type}`, 35, yPosition);
              yPosition += 5;
            }
            
            if (workout.duration) {
              doc.text(`  Duration: ${workout.duration}`, 35, yPosition);
              yPosition += 5;
            }
            
            if (workout.sets && workout.reps) {
              doc.text(`  Sets: ${workout.sets}, Reps: ${workout.reps}`, 35, yPosition);
              yPosition += 5;
            }
            
            if (workout.rest) {
              doc.text(`  Rest: ${workout.rest}`, 35, yPosition);
              yPosition += 5;
            }
            
            // Add exercises if available
            if (workout.exercises && workout.exercises.length > 0) {
              workout.exercises.forEach((exercise, exerciseIndex) => {
                // Check if we need a new page
                if (yPosition > 270) {
                  doc.addPage();
                  yPosition = 20;
                }
                
                doc.setFontSize(10);
                doc.text(`    - ${exercise.name}: ${exercise.sets} sets x ${exercise.reps}`, 40, yPosition);
                if (exercise.rest) {
                  doc.text(` (Rest: ${exercise.rest})`, 40, yPosition + 3);
                  yPosition += 6;
                } else {
                  yPosition += 4;
                }
              });
            }
            
            yPosition += 3; // Extra space between workouts
          });
          
          yPosition += 5; // Extra space between days
        });
        
        yPosition += 8; // Extra space between weeks
      });
    }
    
    // Add footer with date
    const today = new Date();
    doc.setFontSize(10);
    doc.text(`Generated on ${today.toLocaleDateString()}`, 20, 290);
    
    // Save the PDF
    doc.save(`${plan.title.replace(/\s+/g, '_')}_workout_plan.pdf`);
  };

  if (workoutPlans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No workout plans found.</p>
        <p className="text-gray-400 text-sm mt-2">Create your first workout plan to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
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
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {workoutPlans.map((plan) => {
            const isHidden = isWorkoutPlanHidden(plan);
            return (
              <tr key={plan.id} className={isHidden ? 'bg-gray-50 opacity-75' : ''}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {plan.description}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-16 w-16">
                    <img
                      className="h-16 w-16 rounded-lg object-cover"
                      src={getWorkoutPlanThumbnail(plan)}
                      alt={plan.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60";
                      }}
                    />
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    R{plan.price.toFixed(2)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatFitnessType(plan.fitness_type)}
                  </div>
                  {plan.difficulty_level && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getDifficultyColor(plan.difficulty_level)}`}>
                      {plan.difficulty_level}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {plan.duration_weeks ? `${plan.duration_weeks} ${plan.duration_weeks === 1 ? 'Week' : 'Weeks'}` : '-'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatWorkoutDuration(plan.workout_duration)}
                  </div>
                  {plan.estimated_calories_burned && (
                    <div className="text-sm text-gray-500">
                      {formatCaloriesBurned(plan.estimated_calories_burned)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    isHidden ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {isHidden ? 'Hidden' : 'Visible'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onToggleVisibility(plan.id || '', isHidden)}
                    className={`inline-flex items-center p-2 rounded-md ${
                      isHidden 
                        ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                        : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    title={isHidden ? 'Show workout plan' : 'Hide workout plan'}
                  >
                    {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDownloadPlan(plan)}
                    className="inline-flex items-center p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                    title="Download workout plan"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(plan)}
                    className="inline-flex items-center p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md"
                    title="Edit workout plan"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id || '', plan.title)}
                    className="inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                    title="Delete workout plan"
                  >
                    <Trash2 className="h-4 w-4" />
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

export default WorkoutPlansList; 