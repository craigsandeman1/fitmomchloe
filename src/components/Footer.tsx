import { Instagram, Facebook, Youtube, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// Import the image
const logoUrl = new URL('../assets/images/fitmomchloelogo.png', import.meta.url).href;

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-white">
      {/* Newsletter Section */}
      <div className="bg-primary/10 py-16">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-playfair text-3xl mb-4">Join Our Community</h3>
            <p className="text-gray-600 mb-8">
              Get exclusive workout tips, nutrition advice, and special offers delivered to your inbox
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="section-container py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2" onClick={() => window.scrollTo(0, 0)}>
              <img 
                src={logoUrl}
                alt="Fit Mom Chloe Logo" 
                className="h-12 w-auto"
              />
              <span className="font-playfair text-2xl text-primary">
                Fit Mom Chloe
              </span>
            </Link>
            <p className="text-gray-600">
              Empowering moms to live their healthiest, strongest lives through personalized fitness and nutrition guidance.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/fitmomcapetown/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/meal-plans" className="text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Meal Plans
                </Link>
              </li>
              <li>
                <Link to="/workouts" className="text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Workouts
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Book a Session
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-playfair text-lg mb-6">Programs</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  1-on-1 Training
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Group Classes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Online Coaching
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  Nutrition Consulting
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-600">
                <MapPin size={20} />
                <span>Cape Town, South Africa</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Phone size={20} />
                <span>+27 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Mail size={20} />
                <a href="mailto:chloefitness@gmail.com" className="hover:text-primary transition-colors">
                  chloefitness@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} FitMomChloe. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                to="/privacy-policy" 
                className="text-gray-600 hover:text-primary text-sm transition-colors"
                onClick={() => window.scrollTo(0, 0)}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms-of-service" 
                className="text-gray-600 hover:text-primary text-sm transition-colors"
                onClick={() => window.scrollTo(0, 0)}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
