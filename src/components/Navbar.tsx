import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';

// Import the image
import logoImage from '../assets/images/fitmomchloelogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', user.id);

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          return;
        }

        setIsAdmin(Array.isArray(data) && data.length > 0);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav 
      className={`bg-white ${isScrolled ? 'shadow-lg' : 'shadow-md'} fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-0'}`}
    >
      <div className="section-container">
        <div className="flex justify-between items-center h-14 md:h-16">
          <Link to="/" className="flex items-center space-x-2" onClick={() => window.scrollTo(0, 0)}>
            <img 
              src={logoImage}
              alt="Fit Mom Chloe Logo" 
              className={`${isScrolled ? 'h-8 md:h-10' : 'h-10 md:h-12'} w-auto transition-all duration-300`}
              onError={(e) => {
                console.error('Error loading logo:', e);
                setImgError(true);
              }}
              style={{ display: imgError ? 'none' : 'block' }}
            />
            <span className={`font-playfair ${isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} text-primary transition-all duration-300`}>
              Fit Mom Chloe
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
              Home
            </Link>
            <Link to="/meal-plans" className="text-gray-700 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
              Meal Plans
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
              Contact
            </Link>
            <Link to="/book" className="btn-primary" onClick={() => window.scrollTo(0, 0)}>
              Book a Session
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary transition-colors" onClick={() => window.scrollTo(0, 0)}>
                Admin Dashboard
              </Link>
            )}
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-700 hover:text-primary transition-colors"
              >
                <LogOut size={20} className="mr-2" />
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-2">
            <div className="flex flex-col space-y-3 pt-2">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors px-2 py-1" onClick={() => {setIsOpen(false); window.scrollTo(0, 0)}}>
                Home
              </Link>
              <Link to="/meal-plans" className="text-gray-700 hover:text-primary transition-colors px-2 py-1" onClick={() => {setIsOpen(false); window.scrollTo(0, 0)}}>
                Meal Plans
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors px-2 py-1" onClick={() => {setIsOpen(false); window.scrollTo(0, 0)}}>
                Contact
              </Link>
              <Link to="/book" className="btn-primary inline-block text-center px-2 py-1" onClick={() => {setIsOpen(false); window.scrollTo(0, 0)}}>
                Book a Session
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-700 hover:text-primary transition-colors px-2 py-1" onClick={() => {setIsOpen(false); window.scrollTo(0, 0)}}>
                  Admin Dashboard
                </Link>
              )}
              {user && (
                <button
                  onClick={() => {handleSignOut(); setIsOpen(false);}}
                  className="flex items-center text-gray-700 hover:text-primary transition-colors px-2 py-1"
                >
                  <LogOut size={20} className="mr-2" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
