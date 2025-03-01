import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import SEO from '../components/SEO';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={isSuccess ? "Payment Successful! Your Fitness Journey Begins Now | Fit Mom Chloe" : "Payment Canceled | We're Still Here When You're Ready | Fit Mom Chloe"}
        description={isSuccess ? "Your payment was successful! Ready to discover the transformation waiting for you with your new fitness program?" : "Your payment was canceled. When you're ready to transform your body and life, we'll be right here waiting. Why wait any longer?"}
        canonicalUrl={isSuccess ? "/payment/success" : "/payment/cancel"}
      />
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
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
    </div>
  );
};

export default PaymentResult;