import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSuccess = location.pathname === '/payment/success';

  useEffect(() => {
    // Notify parent window of payment result
    if (window.opener) {
      window.opener.postMessage({
        type: isSuccess ? 'PAYFAST_SUCCESS' : 'PAYFAST_CANCEL'
      }, window.location.origin);
      window.close();
    } else {
      // If not in popup, redirect after delay
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="section-container py-20">
      <div className="max-w-md mx-auto text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="font-playfair text-2xl mb-4">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you for your payment. You will be redirected shortly.
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="font-playfair text-2xl mb-4">Payment Cancelled</h1>
            <p className="text-gray-600">
              Your payment was cancelled. You will be redirected shortly.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;