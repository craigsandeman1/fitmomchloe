import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

// Import the image directly
import backgroundImage from '../assets/images/background-homepage.webp';

const Home = () => {
  useEffect(() => {
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
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />

      {/* Programs Section */}
      <section className="relative py-16 md:py-20 w-full">
        {/* Background Image Container */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[120%] bg-primary/5 overflow-hidden">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-25 md:object-center object-left"
          />
        </div>

        <div className="section-container relative z-10">
          <h2 className="font-playfair text-2xl md:text-4xl text-center mb-6 md:mb-16">What I Offer</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-8 px-4 md:px-0">
            <div className="bg-white/40 md:bg-white/70 backdrop-blur-sm md:backdrop-blur p-5 md:p-8 rounded-lg text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <h3 className="font-playfair text-lg md:text-2xl mb-2 md:mb-4">Personal Training</h3>
              <p className="mb-4 md:mb-6 text-sm md:text-base">Personalized 1-on-1 training sessions tailored to your goals</p>
              <Link to="/book" className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3">Book Now</Link>
            </div>
            <div className="bg-white/40 md:bg-white/70 backdrop-blur-sm md:backdrop-blur p-5 md:p-8 rounded-lg text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <h3 className="font-playfair text-lg md:text-2xl mb-2 md:mb-4">Workout Videos</h3>
              <p className="mb-4 md:mb-6 text-sm md:text-base">Access to premium workout content and training programs</p>
              <button disabled className="btn-primary opacity-70 cursor-not-allowed text-sm md:text-base px-4 md:px-6 py-2 md:py-3">Coming Soon</button>
            </div>
            <div className="bg-white/40 md:bg-white/70 backdrop-blur-sm md:backdrop-blur p-5 md:p-8 rounded-lg text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <h3 className="font-playfair text-lg md:text-2xl mb-2 md:mb-4">Meal Plans</h3>
              <p className="mb-4 md:mb-6 text-sm md:text-base">Customized nutrition plans to support your fitness journey</p>
              <Link to="/meal-plans" className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="bg-[#F7F2F0] w-full">
        <h2 className="font-playfair text-2xl md:text-4xl text-center pt-16 md:pt-32 pb-6 md:pb-8">Follow My Journey</h2>
        <div 
          className="elfsight-app-bc1ab87c-9801-4a3d-b414-c409d1543e51" 
          data-elfsight-app-lazy
        ></div>
      </section>
    </div>
  );
};

export default Home;
