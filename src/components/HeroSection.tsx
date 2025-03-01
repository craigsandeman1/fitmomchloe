import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
// ... existing code ...

// Replace imports with public paths
// import withkids from '../assets/images/withkids.jpg';
// import workingout from '../assets/images/workingout.jpg';

// Use public folder paths
const withkidsPath = '/images/withkids.jpg';
const workingoutPath = '/images/workingout.jpg';

interface HeroProps {
  variant?: 'default' | 'alternative';
}

const HeroSection = ({ variant = 'default' }: HeroProps) => {
  const [email, setEmail] = useState('');

  if (variant === 'alternative') {
    return (
      <section className="relative min-h-screen bg-background">
        {/* Background Image Grid */}
        <div className="absolute inset-0 h-[85vh] grid grid-cols-2 md:grid-cols-4 grid-rows-1">
          <div className="relative">
            <img 
              src={withkidsPath}
              alt="Training with kids"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative hidden md:block">
            <img 
              src={workingoutPath}
              alt="Working out"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>

        {/* Top Banner */}
        <div className="absolute top-0 left-0 w-full z-20">
          <div className="bg-primary/20 backdrop-blur-sm py-3 px-4 text-center">
            <p className="text-lg font-medium tracking-wide text-white">
              GET MY FREE FAT-LOSS MEAL PLAN
              <ArrowRight className="inline-block ml-2" size={20} />
              <span className="font-bold ml-2 text-white">HERE</span>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative pt-20 min-h-screen flex flex-col">
          <div className="flex-grow flex items-center">
            <div className="section-container relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="font-playfair text-6xl md:text-7xl mb-8 text-white drop-shadow-lg">
                  You deserve to live in a body you{' '}
                  <span className="text-primary">love</span>
                </h1>
                <p className="text-2xl mb-12 text-white drop-shadow-md">
                  And I want to help you build it
                </p>
                
                <div className="max-w-xl mx-auto">
                  <div className="flex gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none bg-white/90 backdrop-blur"
                    />
                    <button className="btn-primary whitespace-nowrap bg-primary hover:bg-primary/90">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 mt-24 mb-32">
            <div className="section-container">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="font-playfair text-2xl mb-3 text-gray-800">Personalized Plans</h3>
                    <p className="text-gray-600 text-lg">Customized workouts and nutrition plans designed just for you</p>
                  </div>
                  <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="font-playfair text-2xl mb-3 text-gray-800">Expert Guidance</h3>
                    <p className="text-gray-600 text-lg">Professional support every step of the way on your journey</p>
                  </div>
                  <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="font-playfair text-2xl mb-3 text-gray-800">Real Results</h3>
                    <p className="text-gray-600 text-lg">Proven methods that deliver lasting transformation</p>
                  </div>
                </div>
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
  }

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Grid of background images */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div className="relative">
          <img 
            src={withkidsPath}
            alt="Training with kids"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative">
          <img 
            src={workingoutPath}
            alt="Working out"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="section-container relative z-10 text-white text-center">
          <h1 className="font-playfair text-5xl md:text-7xl mb-6">
            Transform Your Life
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join me on a journey to become the strongest, healthiest version of yourself
          </p>
          <Link to="/book" className="btn-primary text-lg">
            Start Your Journey
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;