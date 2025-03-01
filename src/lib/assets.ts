// Assets Helper
// This utility helps with consistent asset referencing across environments

interface AssetMap {
  images: {
    [key: string]: string;
  };
  videos: {
    [key: string]: string;
  };
  assets?: {
    [key: string]: string;
  };
}

// Default asset paths with explicit leading slash to ensure they're absolute
const defaultAssetMap: AssetMap = {
  images: {
    logo: "/images/fitmomchloelogo.png",
    heroBackground: "/images/background-homepage.webp",
    contactHero: "/images/chloe-with-sky.jpg",
    withKids: "/images/withkids.jpg",
    workingOut: "/images/workingout.jpg",
    mealPlan: "/images/meal-plan.jpg"
  },
  videos: {
    workingOut: "/videos/working-out.mp4",
    mealPlan: "/videos/Meal-Plan.mp4"
  },
  assets: {
    logo: "/assets/fitmomchloelogo.png",
    heroBackground: "/assets/background-homepage.webp",
    contactHero: "/assets/chloe-with-sky.jpg",
    withKids: "/assets/withkids.jpg",
    workingOut: "/assets/workingout.jpg",
    mealPlan: "/assets/meal-plan.jpg"
  }
};

// For debugging purposes
console.log("Asset paths initialized:", defaultAssetMap);

let assetMap: AssetMap = defaultAssetMap;

export async function loadAssetMap(): Promise<AssetMap> {
  // If we already have the asset map, return it
  if (assetMap !== defaultAssetMap) return assetMap;
  
  try {
    // Try to load the asset map from the JSON file
    console.log("Attempting to load assets.json...");
    const response = await fetch('/assets.json');
    
    // If the fetch fails (404, network error, etc.), it will throw and go to the catch block
    if (!response.ok) {
      throw new Error(`Failed to load assets.json: ${response.status}`);
    }
    
    const data = await response.json() as AssetMap;
    console.log('Successfully loaded asset map:', data);
    assetMap = data;
    return data;
  } catch (error) {
    console.warn('Using default asset paths due to error:', error);
    // Fallback to default hardcoded paths
    return defaultAssetMap;
  }
}

// Initialize assets map on module load
loadAssetMap().catch(error => console.error("Error initializing asset map:", error));

export function getImagePath(key: string): string {
  // Ensure we have the asset map
  if (!assetMap) {
    console.error("Asset map not initialized when requesting image:", key);
    return `/images/${key}`;
  }
  
  // Return the path from the asset map if it exists
  if (assetMap.images[key]) {
    const path = assetMap.images[key];
    console.log(`Image path for ${key}: ${path}`);
    return path;
  }
  
  // Check if we have the asset in the assets directory
  if (assetMap.assets && assetMap.assets[key]) {
    const path = assetMap.assets[key];
    console.log(`Asset path for ${key}: ${path}`);
    return path;
  }
  
  // Fallback to direct path if the key doesn't exist in the map
  console.warn(`Image key not found in asset map: ${key}, using fallback path`);
  return `/images/${key}`;
}

export function getVideoPath(key: string): string {
  // Ensure we have the asset map
  if (!assetMap) {
    console.error("Asset map not initialized when requesting video:", key);
    return `/videos/${key}`;
  }
  
  // Return the path from the asset map if it exists
  if (assetMap.videos[key]) {
    const path = assetMap.videos[key];
    console.log(`Video path for ${key}: ${path}`);
    return path;
  }
  
  // Fallback to direct path if the key doesn't exist in the map
  console.warn(`Video key not found in asset map: ${key}, using fallback path`);
  return `/videos/${key}`;
}
