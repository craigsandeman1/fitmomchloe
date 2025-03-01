import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import the image
const logoUrl = new URL('../assets/images/fitmomchloelogo.png', import.meta.url).href;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white">
      {/* Main Footer Content */}
      <div className="section-container py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2">
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
                href="https://www.facebook.com/fitmomcapetown/"
                target="_blank"
                rel="noopener noreferrer"
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
                <Link to="/meal-plans" onClick={scrollToTop} className="text-gray-600 hover:text-primary transition-colors">
                  Meal Plans
                </Link>
              </li>
              <li>
                <Link to="/workouts" onClick={scrollToTop} className="text-gray-600 hover:text-primary transition-colors">
                  Workouts
                </Link>
              </li>
              <li>
                <Link to="/book" onClick={scrollToTop} className="text-gray-600 hover:text-primary transition-colors">
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
                <Link to="/book" onClick={scrollToTop} className="text-gray-600 hover:text-primary transition-colors">
                  1-on-1 Training
                </Link>
              </li>
              <li>
                <Link to="/workouts" onClick={scrollToTop} className="text-gray-600 hover:text-primary transition-colors">
                  Group Classes
                </Link>
              </li>
              <li>
                <Link to="/workouts" onClick={scrollToTop} className="text-gray-600 hover:text-primary transition-colors">
                  Online Coaching
                </Link>
              </li>
              <li>
                <Link to="/meal-plans" onClick={scrollToTop} className="text-gray-600 hover:text-primary transition-colors">
                  Nutrition Consulting
                </Link>
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
                <a href="tel:+27829596069" className="hover:text-primary transition-colors">
                  +27 82 959 6069
                </a>
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
              <Link to="/privacy-policy" onClick={scrollToTop} className="text-gray-600 hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" onClick={scrollToTop} className="text-gray-600 hover:text-primary text-sm transition-colors">
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