import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MealPlans from './pages/MealPlans';
import Workouts from './pages/Workouts';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import PaymentResult from './pages/PaymentResult';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/payment/success" element={<PaymentResult />} />
            <Route path="/payment/cancel" element={<PaymentResult />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;