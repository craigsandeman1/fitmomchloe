import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isSuccess = location.pathname === '/payment/success';

  useEffect(() => {
    // Debug logging
    console.log('PaymentResult: Full location:', location);
    console.log('PaymentResult: Search params:', Object.fromEntries(searchParams.entries()));
    console.log('PaymentResult: All URL search params:');
    searchParams.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    console.log('PaymentResult: window.location.href:', window.location.href);
    console.log('PaymentResult: isSuccess:', isSuccess);
    
    // Notify parent window of payment result
    if (window.opener) {
      if (isSuccess) {
        // For successful payments, extract relevant parameters and pass them to parent
        const paymentData = {
          type: 'PAYFAST_SUCCESS',
          planId: searchParams.get('item_name_1') || searchParams.get('planId') || searchParams.get('custom_str1'),
          amount: searchParams.get('amount_gross') || searchParams.get('amount'),
          payment_id: searchParams.get('pf_payment_id') || searchParams.get('payment_id'),
          user_email: searchParams.get('email_address') || searchParams.get('email')
        };
        console.log('PaymentResult: Sending payment data to parent:', paymentData);
        window.opener.postMessage(paymentData, window.location.origin);
      } else {
        console.log('PaymentResult: Sending cancel message to parent');
        window.opener.postMessage({
          type: 'PAYFAST_CANCEL'
        }, window.location.origin);
      }
      window.close();
    } else {
      // If not in popup, handle redirect
      console.log('PaymentResult: Not in popup, handling redirect...');
      if (isSuccess) {
        // Extract payment details and redirect to success page
        const planId = searchParams.get('item_name_1') || searchParams.get('planId') || searchParams.get('custom_str1');
        const amount = searchParams.get('amount_gross') || searchParams.get('amount');
        const paymentId = searchParams.get('pf_payment_id') || searchParams.get('payment_id');
        
        console.log('PaymentResult: Extracted data for redirect:', { planId, amount, paymentId });
        
        if (planId) {
          const successUrl = `/purchase/success?planId=${planId}&type=meal_plan${amount ? `&amount=${amount}` : ''}${paymentId ? `&payment_id=${paymentId}` : ''}`;
          console.log('PaymentResult: Redirecting to:', successUrl);
          navigate(successUrl);
          return;
        } else {
          console.warn('PaymentResult: No planId found, redirecting to meal plans with delay');
        }
      }
      
      // Default redirect for cancelled payments or missing data
      console.log('PaymentResult: Setting default redirect timer to meal plans');
      const timer = setTimeout(() => {
        console.log('PaymentResult: Timer expired, redirecting to meal plans');
        navigate('/meal-plans');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, searchParams, location]);

  return (
    <div className="section-container py-20">
      <div className="max-w-md mx-auto text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="font-playfair text-2xl mb-4">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you for your payment. Redirecting to your purchase details...
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="font-playfair text-2xl mb-4">Payment Cancelled</h1>
            <p className="text-gray-600">
              Your payment was cancelled. Redirecting to meal plans...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;