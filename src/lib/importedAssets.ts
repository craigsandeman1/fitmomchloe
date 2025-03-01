// Direct asset imports
// This utility directly imports assets to ensure they're bundled by Vite

// Import images directly so they're bundled by Vite
import logo from '../assets/images/fitmomchloelogo.png';
import heroBackground from '../assets/images/background-homepage.webp';
import contactHero from '../assets/images/chloe-with-sky.jpg';
import withKids from '../assets/images/withkids.jpg';
import workingOut from '../assets/images/workingout.jpg';
import mealPlan from '../assets/images/meal-plan.jpg';

// Import videos (if needed)
// NOTE: Large video files may cause build problems - consider hosting elsewhere

// Create a mapping of asset keys to their imported URLs
export const imageAssets = {
  logo,
  heroBackground,
  contactHero,
  withKids,
  workingOut,
  mealPlan
};

// Get an image URL by key
export function getImageUrl(key: string): string {
  if (key in imageAssets) {
    console.log(`Imported asset URL for ${key}:`, imageAssets[key as keyof typeof imageAssets]);
    return imageAssets[key as keyof typeof imageAssets];
  }
  
  console.warn(`No imported asset found for key: ${key}, falling back to public path`);
  return `/images/${key}`; 
} 