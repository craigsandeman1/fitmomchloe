import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import logo from '../assets/images/fitmomchloe-logo-large.png';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 pt-12 pb-6 mt-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block" onClick={() => window.scrollTo(0, 0)}>
              <img src={logo} alt="Fit Mom Chloe" className="h-16" />
            </Link>
            <p className="text-gray-600 max-w-sm">
              Empowering individuals to achieve their fitness goals with personalized
              meal plans and training programs.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/fitmomcapetown/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/fit_mom_chloe/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/meal-plans" className="text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Meal Plans
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-gray-600 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Book a Session
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-gray-600">
                <span className="font-medium">Email:</span>{' '}
                <a href="mailto:chloefitness@gmail.com" className="hover:text-primary transition-colors">
                  chloefitness@gmail.com
                </a>
              </li>
              <li className="text-gray-600">
                <span className="font-medium">Location:</span> Cape Town, South Africa
              </li>
              <li className="pt-2">
                <Link to="/privacy-policy" className="text-gray-600 hover:text-primary transition-colors text-sm" onClick={() => window.scrollTo(0, 0)}>
                  Privacy Policy
                </Link>
                {' | '}
                <Link to="/terms-of-service" className="text-gray-600 hover:text-primary transition-colors text-sm" onClick={() => window.scrollTo(0, 0)}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Fit Mom Chloe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
