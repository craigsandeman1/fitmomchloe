import { useState, useEffect } from 'react';
import { getImageUrl, getImageUrlFromPath } from '../lib/imageUtils';

// Test different image loading approaches
// 1. Direct URL Constructor approach (which fails in production as we saw)
const directUrlImage = new URL('../assets/images/fitmomchloelogo.png', import.meta.url).href;
const heroImage = new URL('../assets/images/chloe-with-sky.jpg', import.meta.url).href;
const withkidsImage = new URL('../assets/images/withkids.jpg', import.meta.url).href;
const workingoutImage = new URL('../assets/images/workingout.jpg', import.meta.url).href;

// 2. Public path approach (which works in production)
const publicPathImage = '/images/fitmomchloelogo.png';
const publicMountainImage = '/images/mountain.jpg';

// 3. New utility approach (should work in both environments)
const utilityLogoImage = getImageUrl('logo');
const utilityHeroImage = getImageUrl('contactHero');
const utilityWithKidsImage = getImageUrl('withKids');
const utilityWorkingOutImage = getImageUrl('workingOut');

// 4. Utility with direct path
const utilityPathImage = getImageUrlFromPath('images/mountain.jpg');

const ImageTest = () => {
  // Track loading states
  const [loadingStates, setLoadingStates] = useState({
    directUrl: false,
    heroImage: false,
    withkidsImage: false,
    workingoutImage: false,
    publicPath: false,
    publicMountain: false,
    utilityLogo: false,
    utilityHero: false,
    utilityWithKids: false,
    utilityWorkingOut: false,
    utilityPath: false
  });
  
  const [errorStates, setErrorStates] = useState({
    directUrl: false,
    heroImage: false,
    withkidsImage: false,
    workingoutImage: false,
    publicPath: false,
    publicMountain: false,
    utilityLogo: false,
    utilityHero: false,
    utilityWithKids: false,
    utilityWorkingOut: false,
    utilityPath: false
  });

  useEffect(() => {
    // Log the image URLs for debugging
    console.log('Environment:', import.meta.env.MODE);
    console.log('Is Production:', import.meta.env.PROD);
    
    console.log('1. URL Constructor Approach:');
    console.log('- Logo:', directUrlImage);
    console.log('- Hero Image:', heroImage);
    console.log('- With Kids Image:', withkidsImage);
    console.log('- Working Out Image:', workingoutImage);
    
    console.log('2. Public Path Approach:');
    console.log('- Logo:', publicPathImage);
    console.log('- Mountain:', publicMountainImage);
    
    console.log('3. New Utility Approach:');
    console.log('- Logo:', utilityLogoImage);
    console.log('- Hero Image:', utilityHeroImage);
    console.log('- With Kids Image:', utilityWithKidsImage);
    console.log('- Working Out Image:', utilityWorkingOutImage);
    console.log('- Direct Path:', utilityPathImage);
  }, []);

  const handleImageLoad = (imageType: keyof typeof loadingStates) => {
    console.log(`✅ ${imageType} loaded successfully`);
    setLoadingStates(prev => ({ ...prev, [imageType]: true }));
    setErrorStates(prev => ({ ...prev, [imageType]: false }));
  };

  const handleImageError = (imageType: keyof typeof loadingStates) => {
    console.error(`❌ ${imageType} failed to load`);
    setLoadingStates(prev => ({ ...prev, [imageType]: true }));
    setErrorStates(prev => ({ ...prev, [imageType]: true }));
  };

  return (
    <div className="section-container py-10">
      <h1 className="text-3xl font-bold mb-8">Image Loading Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Test 1: Direct URL Constructor Approach */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test 1: URL Constructor (Logo)</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.directUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.directUrl ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {directUrlImage}
              </div>
            ) : (
              <img
                src={directUrlImage}
                alt="Logo (URL Constructor)"
                className="max-h-full max-w-full object-contain"
                onLoad={() => handleImageLoad('directUrl')}
                onError={() => handleImageError('directUrl')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {directUrlImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.directUrl ? 'Loading...' :
              errorStates.directUrl ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 2: Hero Image */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test 2: URL Constructor (Hero Image)</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.heroImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.heroImage ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {heroImage}
              </div>
            ) : (
              <img
                src={heroImage}
                alt="Hero Image"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('heroImage')}
                onError={() => handleImageError('heroImage')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {heroImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.heroImage ? 'Loading...' :
              errorStates.heroImage ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 3: With Kids Image */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test 3: URL Constructor (With Kids)</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.withkidsImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.withkidsImage ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {withkidsImage}
              </div>
            ) : (
              <img
                src={withkidsImage}
                alt="With Kids Image"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('withkidsImage')}
                onError={() => handleImageError('withkidsImage')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {withkidsImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.withkidsImage ? 'Loading...' :
              errorStates.withkidsImage ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 4: Working Out Image */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test 4: URL Constructor (Working Out)</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.workingoutImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.workingoutImage ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {workingoutImage}
              </div>
            ) : (
              <img
                src={workingoutImage}
                alt="Working Out Image"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('workingoutImage')}
                onError={() => handleImageError('workingoutImage')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {workingoutImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.workingoutImage ? 'Loading...' :
              errorStates.workingoutImage ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 5: Public Path Approach - Logo */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test 5: Public Path (Logo)</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.publicPath && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.publicPath ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {publicPathImage}
              </div>
            ) : (
              <img
                src={publicPathImage}
                alt="Logo (Public Path)"
                className="max-h-full max-w-full object-contain"
                onLoad={() => handleImageLoad('publicPath')}
                onError={() => handleImageError('publicPath')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {publicPathImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.publicPath ? 'Loading...' :
              errorStates.publicPath ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 6: Public Path Approach - Mountain */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test 6: Public Path (Mountain)</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.publicMountain && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.publicMountain ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {publicMountainImage}
              </div>
            ) : (
              <img
                src={publicMountainImage}
                alt="Mountain (Public Path)"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('publicMountain')}
                onError={() => handleImageError('publicMountain')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {publicMountainImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.publicMountain ? 'Loading...' :
              errorStates.publicMountain ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 7: Utility Approach - Logo */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test 7: Utility Approach (Logo)</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.utilityLogo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.utilityLogo ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {utilityLogoImage}
              </div>
            ) : (
              <img
                src={utilityLogoImage}
                alt="Logo (Utility)"
                className="max-h-full max-w-full object-contain"
                onLoad={() => handleImageLoad('utilityLogo')}
                onError={() => handleImageError('utilityLogo')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {utilityLogoImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.utilityLogo ? 'Loading...' :
              errorStates.utilityLogo ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 8: Utility Approach - Hero */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test 8: Utility Approach (Hero)</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.utilityHero && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.utilityHero ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {utilityHeroImage}
              </div>
            ) : (
              <img
                src={utilityHeroImage}
                alt="Hero (Utility)"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('utilityHero')}
                onError={() => handleImageError('utilityHero')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {utilityHeroImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.utilityHero ? 'Loading...' :
              errorStates.utilityHero ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 9: Direct Path Utility */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test 9: Direct Path Utility</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.utilityPath && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.utilityPath ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {utilityPathImage}
              </div>
            ) : (
              <img
                src={utilityPathImage}
                alt="Mountain (Utility Path)"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('utilityPath')}
                onError={() => handleImageError('utilityPath')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {utilityPathImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.utilityPath ? 'Loading...' :
              errorStates.utilityPath ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Technical Information</h2>
        <div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-auto">
          <p>import.meta.url: {import.meta.url}</p>
          <p className="mt-2">Environment: {import.meta.env.MODE}</p>
          <p className="mt-2">Base URL: {import.meta.env.BASE_URL}</p>
          <p className="mt-2">User Agent: {navigator.userAgent}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageTest; 