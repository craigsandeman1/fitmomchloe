import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="section-container py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <XCircle className="text-red-500" size={64} />
        </div>
        <h1 className="font-playfair text-4xl mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made.
        </p>
        <button
          onClick={() => navigate('/meal-plans')}
          className="btn-primary"
        >
          Return to Meal Plans
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelled; 