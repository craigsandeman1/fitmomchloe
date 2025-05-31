import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MealPlans from './pages/MealPlans';
import MealPlansSimple from './pages/MealPlansSimple';
import Workouts from './pages/Workouts';
import WorkoutPlans from './pages/WorkoutPlans';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import PaymentResult from './pages/PaymentResult';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Login from './pages/Login';
import PayfastTest from './pages/PayfastTest';
import Contact from './pages/Contact';
import Footer from './components/Footer';

// Cookie Consent Banner Component
const CookieConsent = ({ onAccept }: { onAccept: () => void }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          This website uses cookies to ensure you get the best experience. By continuing to use this site, you consent to our use of cookies.
          <a href="/privacy-policy" className="text-primary underline ml-1">Learn more</a>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onAccept}
            className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] text-white px-4 py-2 rounded-md text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      setShowCookieConsent(true);
    }
  }, []);
  
  const handleCookieAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieConsent(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col w-full max-w-[100vw] overflow-x-hidden">
        <Navbar />
        <main className="flex-grow pt-16 w-full max-w-[100vw] overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/meal-plans-simple" element={<MealPlansSimple />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workout-plans" element={<WorkoutPlans />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/payment/success" element={<PaymentResult />} />
            <Route path="/payment/cancel" element={<PaymentResult />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payfast-test" element={<PayfastTest />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        {showCookieConsent && <CookieConsent onAccept={handleCookieAccept} />}
      </div>
    </Router>
  );
}

export default App;
