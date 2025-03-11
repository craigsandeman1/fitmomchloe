import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import yogaWithZozo from '../assets/images/yoga-with-zozo.webp';
import workingout from '../assets/images/workingout.jpg';
import salmon from '../assets/images/salmon.webp';
import beanSalad from '../assets/images/bean-salad.webp';

const HeroSection = () => {
  return (
    <>
      {/* MOBILE HERO - Only visible on small screens */}
      <section className="sm:hidden relative w-full overflow-hidden">
        {/* Mobile Background Image */}
        <div className="absolute inset-0 h-[90vh]">
          <img 
            src={yogaWithZozo}
            alt="Yoga with Zozo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Mobile Banner */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Link to="/meal-plans#available-plans" className="block">
            <div className="bg-primary/20 backdrop-blur-sm py-2 px-2 text-center hover:bg-primary/30 transition-colors">
              <p className="text-sm font-medium tracking-wide text-white truncate">
                EXPLORE MY PREMIUM MEAL PLANS
                <ArrowRight className="inline-block ml-1" size={16} />
                <span className="font-bold ml-1 text-white">HERE</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Mobile Content - Very simple structure */}
        <div className="relative min-h-[90vh] flex items-center justify-center z-10">
          <div className="text-center px-4 py-8">
            <h1 className="font-playfair text-3xl md:text-5xl text-white drop-shadow-lg leading-normal">
              You deserve to <br />
              live in a body <br />
              you <span className="text-primary">love</span>
            </h1>
            
            <p className="text-lg mt-4 mb-6 text-white drop-shadow-md">
              And I want to help you build it
            </p>
            
            <Link 
              to="/meal-plans" 
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] shadow-lg text-white rounded-lg text-base px-6 py-3 inline-flex items-center justify-center"
            >
              Explore Meal Plans
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>

        {/* Mobile Wave Background */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-background">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* DESKTOP HERO - Hidden on small screens */}
      <section className="hidden sm:block relative w-full overflow-hidden bg-background">
        {/* Background Image Grid */}
        <div className="absolute inset-0 h-full min-h-[85vh]">
          {/* Four images grid layout for desktop */}
          <div className="absolute inset-0 w-1/4 left-0">
            <img 
              src={yogaWithZozo}
              alt="Yoga with Zozo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="absolute inset-0 w-1/4 left-1/4">
            <img 
              src={salmon}
              alt="Healthy salmon meal"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="absolute inset-0 w-1/4 left-2/4">
            <img 
              src={workingout}
              alt="Working out"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="absolute inset-0 w-1/4 left-3/4">
            <img 
              src={beanSalad}
              alt="Bean salad"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>

        {/* Desktop Banner */}
        <div className="absolute top-0 left-0 w-full z-20">
          <Link to="/meal-plans#available-plans" className="block">
            <div className="bg-primary/20 backdrop-blur-sm py-3 px-4 text-center hover:bg-primary/30 transition-colors">
              <p className="text-base font-medium tracking-wide text-white truncate">
                EXPLORE MY PREMIUM MEAL PLANS
                <ArrowRight className="inline-block ml-2" size={16} />
                <span className="font-bold ml-2 text-white">HERE</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Content */}
        <div className="relative w-full min-h-[90vh] flex flex-col justify-center items-center pb-16">
          <div className="relative z-10 w-full px-6 md:px-8 max-w-5xl mx-auto pt-16">
            <div className="text-center">
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 md:mb-8 text-white drop-shadow-lg">
                You deserve to live in a body you <span className="text-primary">love</span>
              </h1>
              <p className="text-xl md:text-xl mb-10 text-white drop-shadow-md max-w-xl mx-auto">
                And I want to help you build it
              </p>
              
              <Link 
                to="/meal-plans" 
                className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] shadow-lg shadow-primary/30 transform transition-all duration-200 hover:scale-[1.02] text-white rounded-lg text-base md:text-lg px-6 md:px-8 py-3 inline-flex items-center justify-center"
              >
                Explore Meal Plans
                <ArrowRight className="ml-2 md:ml-3" size={20} />
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 w-full px-4 max-w-5xl mx-auto mt-16 md:mt-20">
            <div className="grid md:grid-cols-3 gap-4 md:gap-8">
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

        {/* Desktop Wave Background */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-background">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
    </>
  );
};

export default HeroSection;