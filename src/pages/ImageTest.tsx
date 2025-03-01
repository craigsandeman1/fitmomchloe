import { useState } from 'react';
import { getImageUrl, getImageUrlFromPath } from '../lib/imageUtils';

// Use our simple utility approach (direct public paths)
const logoImage = getImageUrl('logo');
const heroImage = getImageUrl('contactHero');
const withkidsImage = getImageUrl('withKids');
const workingoutImage = getImageUrl('workingOut');
const mountainImage = getImageUrlFromPath('images/mountain.jpg');

const ImageTest = () => {
  // Track loading states
  const [loadingStates, setLoadingStates] = useState({
    logo: false,
    hero: false,
    withkids: false,
    workingout: false,
    mountain: false
  });
  
  const [errorStates, setErrorStates] = useState({
    logo: false,
    hero: false,
    withkids: false,
    workingout: false,
    mountain: false
  });

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
      <h1 className="text-3xl font-bold mb-8">Simplified Image Loading Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Test 1: Logo */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Logo Image</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.logo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.logo ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {logoImage}
              </div>
            ) : (
              <img
                src={logoImage}
                alt="Logo"
                className="max-h-full max-w-full object-contain"
                onLoad={() => handleImageLoad('logo')}
                onError={() => handleImageError('logo')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {logoImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.logo ? 'Loading...' :
              errorStates.logo ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 2: Hero Image */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Hero Image</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.hero && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.hero ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {heroImage}
              </div>
            ) : (
              <img
                src={heroImage}
                alt="Hero Image"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('hero')}
                onError={() => handleImageError('hero')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {heroImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.hero ? 'Loading...' :
              errorStates.hero ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 3: With Kids Image */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">With Kids Image</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.withkids && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.withkids ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {withkidsImage}
              </div>
            ) : (
              <img
                src={withkidsImage}
                alt="With Kids Image"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('withkids')}
                onError={() => handleImageError('withkids')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {withkidsImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.withkids ? 'Loading...' :
              errorStates.withkids ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 4: Working Out Image */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Working Out Image</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.workingout && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.workingout ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {workingoutImage}
              </div>
            ) : (
              <img
                src={workingoutImage}
                alt="Working Out Image"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('workingout')}
                onError={() => handleImageError('workingout')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {workingoutImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.workingout ? 'Loading...' :
              errorStates.workingout ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>

        {/* Test 5: Mountain Image */}
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mountain Image</h2>
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative mb-4">
            {!loadingStates.mountain && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            {errorStates.mountain ? (
              <div className="text-red-500 text-center p-4">
                Failed to load image.<br />
                URL: {mountainImage}
              </div>
            ) : (
              <img
                src={mountainImage}
                alt="Mountain Image"
                className="max-h-full max-w-full object-cover"
                onLoad={() => handleImageLoad('mountain')}
                onError={() => handleImageError('mountain')}
              />
            )}
          </div>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            <p>URL: {mountainImage}</p>
            <p className="mt-2">Status: {
              !loadingStates.mountain ? 'Loading...' :
              errorStates.mountain ? 'Error' : 'Loaded'
            }</p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">About This Test</h2>
        <p className="mb-4">
          This test page uses direct public paths to access images. All images are loaded from the `/images/` directory in the public folder.
        </p>
        <p>
          These paths should work reliably in both development and production environments without requiring complex URL construction.
        </p>
      </div>
    </div>
  );
};

export default ImageTest; 