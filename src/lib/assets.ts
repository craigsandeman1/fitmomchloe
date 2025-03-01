// Assets Helper
// This utility helps with consistent asset referencing across environments

interface AssetMap {
  images: {
    [key: string]: string;
  };
  videos: {
    [key: string]: string;
  };
}

// Default asset paths that work in both development and production
const defaultAssetMap: AssetMap = {
  images: {
    logo: '/images/fitmomchloelogo.png',
    heroBackground: '/images/background-homepage.webp',
    contactHero: '/images/chloe-with-sky.jpg',
    withKids: '/images/withkids.jpg',
    workingOut: '/images/workingout.jpg',
    mealPlan: '/images/meal-plan.jpg'
  },
  videos: {
    workingOut: '/videos/working-out.mp4',
    mealPlan: '/videos/Meal-Plan.mp4'
  }
};

let assetMap: AssetMap = defaultAssetMap;

export async function loadAssetMap(): Promise<AssetMap> {
  // If we already have the asset map, return it
  if (assetMap !== defaultAssetMap) return assetMap;
  
  try {
    // Try to load the asset map from the JSON file
    const response = await fetch('/assets.json');
    
    // If the fetch fails (404, network error, etc.), it will throw and go to the catch block
    if (!response.ok) {
      throw new Error(`Failed to load assets.json: ${response.status}`);
    }
    
    const data = await response.json() as AssetMap;
    assetMap = data;
    console.log('Loaded asset map:', data);
    return data;
  } catch (error) {
    console.warn('Using default asset paths:', error);
    return defaultAssetMap;
  }
}

// Initialize assets map on module load
loadAssetMap().catch(console.error);

export function getImagePath(key: string): string {
  // Return the path from the asset map if it exists
  if (assetMap.images[key]) {
    return assetMap.images[key];
  }
  
  // Fallback to direct path if the key doesn't exist in the map
  return `/images/${key}`;
}

export function getVideoPath(key: string): string {
  // Return the path from the asset map if it exists
  if (assetMap.videos[key]) {
    return assetMap.videos[key];
  }
  
  // Fallback to direct path if the key doesn't exist in the map
  return `/videos/${key}`;
} 