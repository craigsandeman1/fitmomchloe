/**
 * Image utility for handling image paths in both development and production environments
 * 
 * In development: Uses the URL constructor pattern for Vite's dev server
 * In production: Uses the public directory paths which work reliably in production
 */

// Import.meta.env.PROD is a Vite feature that tells us if we're in production mode
const isProduction = import.meta.env.PROD;

// Map of image keys to their public directory paths
const PUBLIC_IMAGE_PATHS = {
  logo: '/images/fitmomchloelogo.png',
  heroBackground: '/images/background-homepage.webp',
  contactHero: '/images/chloe-with-sky.jpg',
  withKids: '/images/withkids.jpg',
  workingOut: '/images/workingout.jpg',
  mealPlan: '/images/meal-plan.jpg',
  mountain: '/images/mountain.jpg',
  // Add any other images you need here
};

// Development paths using URL constructor
const getDevImagePath = (imagePath: string): string => {
  try {
    // Path should be relative to this file, so we need to adjust it
    return new URL(`../assets/${imagePath}`, import.meta.url).href;
  } catch (error) {
    console.error(`Error creating URL for ${imagePath}:`, error);
    // Fallback to public path if URL constructor fails
    return `/${imagePath}`;
  }
};

/**
 * Get the appropriate image URL for the current environment
 * @param key - The image key as defined in the PUBLIC_IMAGE_PATHS object
 * @returns A string URL path to the image
 */
export const getImageUrl = (key: keyof typeof PUBLIC_IMAGE_PATHS): string => {
  // In production, always use the public directory paths
  if (isProduction) {
    return PUBLIC_IMAGE_PATHS[key];
  }
  
  // In development, try the URL constructor approach first
  const imagePath = PUBLIC_IMAGE_PATHS[key].replace('/images/', 'images/');
  return getDevImagePath(imagePath);
};

/**
 * Get the URL for an image directly from its path
 * @param path - Image path relative to src/assets or public directory
 * @returns A string URL path to the image
 */
export const getImageUrlFromPath = (path: string): string => {
  if (isProduction) {
    // Make sure path starts with a slash for public directory
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // For development
  return getDevImagePath(path.replace(/^\//, ''));
}; 