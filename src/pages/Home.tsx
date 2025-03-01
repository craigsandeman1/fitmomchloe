import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { imageAssets } from '../lib/importedAssets';
import { getImagePath } from '../lib/assets';

// Use the directly imported asset
const backgroundImageUrl = imageAssets.heroBackground;
// Also get the fallback path
const fallbackBackgroundUrl = getImagePath('heroBackground');

console.log('Home using backgroundImage URL:', backgroundImageUrl);
console.log('Home fallback backgroundImage URL:', fallbackBackgroundUrl);

const Home = () => {
  useEffect(() => {
    // Preload background image
    const img = new Image();
    img.src = backgroundImageUrl;
    img.onload = () => console.log('Background image loaded successfully');
    img.onerror = (e) => console.error('Failed to load background image:', e);

    // Load Elfsight script
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      #eapps-instagram-feed-2 .eapps-instagram-feed-header {
        background: rgb(247 242 240);
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup script and styles when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection variant="alternative" />

      {/* Programs Section */}
      <section className="relative py-20">
        {/* Background Image Container */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[120%] bg-primary/5 overflow-hidden">
          <img
            src={backgroundImageUrl}
            alt=""
            className="w-full h-full object-cover opacity-25 md:object-center object-left"
            onError={(e) => {
              console.error('Error loading background image:', e);
              // Try the fallback path instead
              (e.target as HTMLImageElement).src = fallbackBackgroundUrl;
            }}
          />
        </div>

        <div className="section-container relative z-10">
          <h2 className="font-playfair text-4xl text-center mb-8 md:mb-16">What I Offer</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-8 px-4 md:px-0">
            <div className="bg-white/40 md:bg-white/70 backdrop-blur-sm md:backdrop-blur p-6 md:p-8 rounded-lg text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <h3 className="font-playfair text-xl md:text-2xl mb-3 md:mb-4">Personal Training</h3>
              <p className="mb-6 text-sm md:text-base">Personalized 1-on-1 training sessions tailored to your goals</p>
              <Link to="/book" className="btn-primary">Book Now</Link>
            </div>
            <div className="bg-white/40 md:bg-white/70 backdrop-blur-sm md:backdrop-blur p-6 md:p-8 rounded-lg text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <h3 className="font-playfair text-xl md:text-2xl mb-3 md:mb-4">Workout Videos</h3>
              <p className="mb-6 text-sm md:text-base">Access to premium workout content and training programs</p>
              <Link to="/workouts" className="btn-primary">View Library</Link>
            </div>
            <div className="bg-white/40 md:bg-white/70 backdrop-blur-sm md:backdrop-blur p-6 md:p-8 rounded-lg text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <h3 className="font-playfair text-xl md:text-2xl mb-3 md:mb-4">Meal Plans</h3>
              <p className="mb-6 text-sm md:text-base">Customized nutrition plans to support your fitness journey</p>
              <Link to="/meal-plans" className="btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="bg-[#F7F2F0]">
        <h2 className="font-playfair text-4xl text-center pt-32 pb-8">Follow My Journey</h2>
        <div 
          className="elfsight-app-bc1ab87c-9801-4a3d-b414-c409d1543e51" 
          data-elfsight-app-lazy
        ></div>
      </section>
    </div>
  );
};

export default Home;
