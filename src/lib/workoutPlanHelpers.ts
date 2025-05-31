import { WorkoutPlan } from '../types/workout-plan';

// Helper function to get workout plan thumbnail URL
export const getWorkoutPlanThumbnail = (plan: WorkoutPlan): string => {
  // 1. Check for direct thumbnail_url property
  if (plan.thumbnail_url) {
    return plan.thumbnail_url;
  }
  
  // 2. Check for image_url property
  if (plan.image_url) {
    return plan.image_url;
  }
  
  // 3. Check in content.metadata.thumbnailUrl
  if (plan.content?.metadata?.thumbnailUrl) {
    return plan.content.metadata.thumbnailUrl;
  }
  
  // 4. Return default workout plan image
  return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60";
};

// Helper function to format workout duration
export const formatWorkoutDuration = (duration?: string): string => {
  if (!duration) return "45 minutes";
  return duration;
};

// Helper function to format fitness type
export const formatFitnessType = (type?: string): string => {
  if (!type) return "General Fitness";
  return type;
};

// Helper function to format target muscle groups
export const formatTargetMuscleGroups = (groups?: string): string => {
  if (!groups) return "Full Body";
  return groups;
};

// Helper function to get difficulty color
export const getDifficultyColor = (level?: string): string => {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to estimate workout calories
export const formatCaloriesBurned = (calories?: number): string => {
  if (!calories) return "250-400 calories";
  return `~${calories} calories`;
}; 