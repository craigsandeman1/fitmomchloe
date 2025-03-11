import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import yogaWithZozo from '../assets/images/yoga-with-zozo.webp';
import workingout from '../assets/images/workingout.jpg';
import salmon from '../assets/images/salmon.webp';
import beanSalad from '../assets/images/bean-salad.webp';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Image Grid - Fixed height, only one image on mobile */}
      <div className="absolute inset-0 h-[85vh]">
        {/* First image - visible on all screen sizes, takes full width on mobile */}
        <div className="absolute inset-0 md:w-1/4 md:left-0">
          <img 
            src={yogaWithZozo}
            alt="Yoga with Zozo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Other images - hidden on mobile, displayed on larger screens */}
        <div className="absolute inset-0 w-1/4 left-1/4 hidden md:block">
          <img 
            src={salmon}
            alt="Healthy salmon meal"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 w-1/4 left-2/4 hidden md:block">
          <img 
            src={workingout}
            alt="Working out"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 w-1/4 left-3/4 hidden md:block">
          <img 
            src={beanSalad}
            alt="Bean salad"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      {/* Top Banner */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Link to="/meal-plans#available-plans" className="block">
          <div className="bg-primary/20 backdrop-blur-sm py-2 px-2 md:py-3 md:px-4 text-center hover:bg-primary/30 transition-colors">
            <p className="text-sm sm:text-base md:text-base font-medium tracking-wide text-white truncate">
              EXPLORE MY PREMIUM MEAL PLANS
              <ArrowRight className="inline-block ml-1 md:ml-2" size={16} />
              <span className="font-bold ml-1 md:ml-2 text-white">HERE</span>
            </p>
          </div>
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="relative w-full min-h-screen flex flex-col justify-center items-center">
        {/* Text Container */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 max-w-5xl mx-auto pt-16">
          <div className="text-center">
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-6 md:mb-8 text-white drop-shadow-lg">
              You deserve to live in<br className="sm:hidden" /> a body you <span className="text-primary">love</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-xl mb-8 md:mb-10 text-white drop-shadow-md max-w-xl mx-auto">
              And I want to help you build it
            </p>
            
            <div className="flex justify-center mt-2 md:mt-4">
              <Link 
                to="/meal-plans" 
                className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] shadow-lg shadow-primary/30 transform transition-all duration-200 hover:scale-[1.02] text-white rounded-lg text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-3 inline-flex items-center justify-center"
              >
                Explore Meal Plans
                <ArrowRight className="ml-2 md:ml-3" size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Cards - Only show on larger screens */}
        <div className="relative z-10 w-full px-4 max-w-5xl mx-auto mt-16 md:mt-20 mb-16">
          <div className="hidden sm:grid md:grid-cols-3 gap-4 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
              <h3 className="font-playfair text-xl md:text-2xl mb-3 text-gray-800">Personalized Plans</h3>
              <p className="text-gray-600 text-base md:text-lg">Customized workouts and nutrition plans designed just for you</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
              <h3 className="font-playfair text-xl md:text-2xl mb-3 text-gray-800">Expert Guidance</h3>
              <p className="text-gray-600 text-base md:text-lg">Professional support every step of the way on your journey</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
              <h3 className="font-playfair text-xl md:text-2xl mb-3 text-gray-800">Real Results</h3>
              <p className="text-gray-600 text-base md:text-lg">Proven methods that deliver lasting transformation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Background */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-background">
          <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection; 