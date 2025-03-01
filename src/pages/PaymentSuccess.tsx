import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Purchase } from '../types';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        const purchaseId = searchParams.get('custom_str1');
        if (!purchaseId) {
          setError('Purchase ID not found');
          setLoading(false);
          return;
        }

        // Poll for purchase status
        let attempts = 0;
        const maxAttempts = 10;
        const pollInterval = 2000; // 2 seconds

        const pollStatus = async () => {
          const { data, error: fetchError } = await supabase
            .from('purchases')
            .select('*, meal_plans(*)')
            .eq('id', purchaseId)
            .single();

          if (fetchError) throw fetchError;

          if (data) {
            if (data.status === 'completed') {
              setPurchase(data);
              setLoading(false);
              return true;
            } else if (data.status === 'failed') {
              setError('Payment failed');
              setLoading(false);
              return true;
            }
          }

          if (++attempts >= maxAttempts) {
            setError('Payment verification timeout');
            setLoading(false);
            return true;
          }

          return false;
        };

        // Start polling
        const poll = async () => {
          const finished = await pollStatus();
          if (!finished) {
            setTimeout(poll, pollInterval);
          }
        };

        await poll();

      } catch (error) {
        console.error('Error checking purchase status:', error);
        setError('Error verifying payment');
        setLoading(false);
      }
    };

    checkPurchaseStatus();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="section-container py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <Loader className="animate-spin text-primary" size={64} />
          </div>
          <h1 className="font-playfair text-4xl mb-4">Verifying Payment</h1>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8 flex justify-center text-red-500">
            <CheckCircle size={64} />
          </div>
          <h1 className="font-playfair text-4xl mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => navigate('/meal-plans')}
            className="btn-primary"
          >
            Return to Meal Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <CheckCircle className="text-green-500" size={64} />
        </div>
        <h1 className="font-playfair text-4xl mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for purchasing {purchase?.meal_plans?.title}. You can now access your meal plan.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full"
          >
            View My Meal Plan
          </button>
          <button
            onClick={() => navigate('/meal-plans')}
            className="btn-secondary w-full"
          >
            Browse More Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 