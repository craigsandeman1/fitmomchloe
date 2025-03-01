import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';
import { imageAssets } from '../lib/importedAssets';
import { getImagePath } from '../lib/assets';

// Use the directly imported asset
const logoUrl = imageAssets.logo;

console.log('Navbar using logo URL:', logoUrl);
// Also log the fallback path
console.log('Navbar fallback logo URL:', getImagePath('logo'));

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuthStore();

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
    <nav className="bg-white shadow-md">
      <div className="section-container">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logoUrl}
              alt="Fit Mom Chloe Logo" 
              className="h-12 w-auto"
              onError={(e) => {
                console.error('Error loading logo:', e);
                // Try the fallback path instead
                (e.target as HTMLImageElement).src = getImagePath('logo');
              }}
            />
            <span className="font-playfair text-2xl text-primary">
              Fit Mom Chloe
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/meal-plans" className="text-gray-700 hover:text-primary transition-colors">
              Meal Plans
            </Link>
            <Link to="/workouts" className="text-gray-700 hover:text-primary transition-colors">
              Workouts
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/book" className="btn-primary">
              Book a Session
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary transition-colors">
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
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/meal-plans" className="text-gray-700 hover:text-primary transition-colors">
                Meal Plans
              </Link>
              <Link to="/workouts" className="text-gray-700 hover:text-primary transition-colors">
                Workouts
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">
                Contact
              </Link>
              <Link to="/book" className="btn-primary inline-block text-center">
                Book a Session
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-700 hover:text-primary transition-colors">
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
