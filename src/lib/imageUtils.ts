/**
 * Image utility for loading images reliably in both development and production
 * 
 * This simplified approach uses public directory paths which work in all environments
 */

// Map of image keys to their public directory paths
const IMAGE_PATHS = {
  logo: '/images/fitmomchloelogo.png',
  heroBackground: '/images/background-homepage.webp',
  contactHero: '/images/chloe-with-sky.jpg',
  withKids: '/images/withkids.jpg',
  workingOut: '/images/workingout.jpg',
  mealPlan: '/images/meal-plan.jpg',
  mountain: '/images/mountain.jpg',
  // Add any other images you need here
};

/**
 * Get the appropriate image URL by key
 * @param key - The image key as defined in the IMAGE_PATHS object
 * @returns A string URL path to the image
 */
export const getImageUrl = (key: keyof typeof IMAGE_PATHS): string => {
  return IMAGE_PATHS[key];
};

/**
 * Get the URL for an image directly from its path
 * @param path - Image path relative to public directory
 * @returns A string URL path to the image
 */
export const getImageUrlFromPath = (path: string): string => {
  // Make sure path starts with a slash for public directory
  return path.startsWith('/') ? path : `/${path}`;
}; 