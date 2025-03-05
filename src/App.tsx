import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MealPlans from './pages/MealPlans';
import MealPlansSimple from './pages/MealPlansSimple';
import Workouts from './pages/Workouts';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import PaymentResult from './pages/PaymentResult';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Login from './pages/Login';
import Footer from './components/Footer';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Login from './pages/Login';

function App() {
  return (
<<<<<<< Updated upstream
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/meal-plans" element={<MealPlans />} />
              <Route path="/meal-plans-simple" element={<MealPlansSimple />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/book" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/payment/success" element={<PaymentResult />} />
              <Route path="/payment/cancel" element={<PaymentResult />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
=======
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/meal-plans-simple" element={<MealPlansSimple />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
            
            <Route path="/payment/success" element={<PaymentResult />} />
            <Route path="/payment/cancel" element={<PaymentResult />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
>>>>>>> Stashed changes
  );
}

export default App;
