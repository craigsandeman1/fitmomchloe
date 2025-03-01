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

let assetMap: AssetMap | null = null;

export async function loadAssetMap(): Promise<AssetMap> {
  if (assetMap) return assetMap;
  
  try {
    const response = await fetch('/assets.json');
    const data = await response.json() as AssetMap;
    assetMap = data;
    return data;
  } catch (error) {
    console.error('Failed to load assets.json:', error);
    // Fallback to default paths
    const fallbackMap: AssetMap = {
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
    assetMap = fallbackMap;
    return fallbackMap;
  }
}

// Initialize assets map on module load
loadAssetMap().catch(console.error);

export function getImagePath(key: string): string {
  // Direct path as fallback
  if (!assetMap) return `/images/${key}`;
  return assetMap.images[key] || `/images/${key}`;
}

export function getVideoPath(key: string): string {
  // Direct path as fallback
  if (!assetMap) return `/videos/${key}`;
  return assetMap.videos[key] || `/videos/${key}`;
} 