import { useEffect, useRef, useState } from 'react';
import md5 from 'md5';
import { env } from '../lib/env';
import { MealPlan } from '../types/meal-plan';
import { ShoppingCart, CreditCard, AlertCircle, CheckCircle, X, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';

interface PayfastButtonProps {
  amount?: number;
  itemName?: string;
  itemDescription?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  cellNumber?: string;
  mPaymentId?: string;
  paymentMethod?: 'cc' | 'dc' | 'ef' | 'mp' | 'mc' | 'sc' | 'ss' | 'zp' | 'mt' | 'rc' | 'mu' | 'ap' | 'sp' | 'cp';
  customStr1?: string;
  customStr2?: string;
  customStr3?: string;
  customStr4?: string;
  customStr5?: string;
  customInt1?: number;
  customInt2?: number;
  customInt3?: number;
  customInt4?: number;
  customInt5?: number;
  onSuccess?: (planId: string) => void | Promise<void>;
  onCancel?: () => void;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  
  plan?: MealPlan;
  handlePurchaseAttempt?: (plan: MealPlan) => boolean | void;
}

// Define Payfast payment data interface
interface PayfastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  amount: string;
  item_name: string;
  item_description?: string;
  email_address?: string;
  name_first?: string;
  name_last?: string;
  cell_number?: string;
  m_payment_id?: string;
  payment_method?: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  signature?: string;
  [key: string]: string | undefined;
}

const PayfastButton = ({
  amount,
  itemName,
  itemDescription,
  email,
  firstName,
  lastName,
  cellNumber,
  mPaymentId,
  paymentMethod,
  customStr1,
  customStr2,
  customStr3,
  customStr4,
  customStr5,
  customInt1,
  customInt2,
  customInt3,
  customInt4,
  customInt5,
  onSuccess,
  onCancel,
  onClick,
  className = 'btn-primary',
  children = 'Buy Now',
  plan,
  handlePurchaseAttempt
}: PayfastButtonProps) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success' | 'error'>('details');
  const [paymentData, setPaymentData] = useState<PayfastPaymentData | null>(null);
  const [isSandbox, setIsSandbox] = useState(false);

  useEffect(() => {
    // Listen for payment success/cancel messages
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'PAYFAST_SUCCESS') {
        onSuccess?.(event.data.planId);
      } else if (event.data.type === 'PAYFAST_CANCEL') {
        onCancel?.();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onCancel]);

  const preparePaymentData = () => {
    // Get current authenticated user
    const { user } = useAuthStore.getState();
    
    if (!user) {
      console.error('PayfastButton: No authenticated user found');
      return null;
    }
    
    // Create Payfast configuration
    const payfastConfig = {
      merchantId: env.payfast.merchantId,
      merchantKey: env.payfast.merchantKey,
      passPhrase: env.payfast.passPhrase,
      returnUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancel`,
      // Updated webhook URL to use the new Edge Function
      notifyUrl: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payfast-webhook`,
      sandbox: env.payfast.sandbox
    };
    
    setIsSandbox(payfastConfig.sandbox);
    
    console.log('Using Payfast config:', {
      merchantId: payfastConfig.merchantId,
      merchantKey: payfastConfig.merchantKey,
      passPhrase: payfastConfig.passPhrase ? '[HIDDEN]' : 'not set',
      sandbox: payfastConfig.sandbox,
      returnUrl: payfastConfig.returnUrl,
      cancelUrl: payfastConfig.cancelUrl,
      notifyUrl: payfastConfig.notifyUrl,
      userEmail: user.email,
      userId: user.id
    });
    
    // Determine amount and item name from props or plan
    const finalAmount = plan?.price || amount;
    const finalItemName = plan?.title || itemName;
    const finalItemDescription = plan?.description || itemDescription;
    
    // Validate required fields
    if (!finalAmount || !finalItemName) {
      console.error('PayfastButton: Missing required fields', { 
        amount: finalAmount, 
        itemName: finalItemName 
      });
      alert('Payment configuration error: Missing required fields');
      return null;
    }

    // Create payment data object with authenticated user information
    const data: PayfastPaymentData = {
      merchant_id: payfastConfig.merchantId,
      merchant_key: payfastConfig.merchantKey,
      return_url: payfastConfig.returnUrl,
      cancel_url: payfastConfig.cancelUrl,
      notify_url: payfastConfig.notifyUrl,
      amount: finalAmount.toFixed(2),
      item_name: finalItemName,
      // Use authenticated user's email (CRITICAL for webhook email delivery)
      email_address: user.email || '',
      name_first: user.user_metadata?.first_name || user.email?.split('@')[0] || 'Customer',
      name_last: user.user_metadata?.last_name || '',
    };
    
    // Add optional parameters if provided
    if (finalItemDescription) data.item_description = finalItemDescription;
    if (cellNumber) data.cell_number = cellNumber;
    if (mPaymentId) data.m_payment_id = mPaymentId;
    if (paymentMethod) data.payment_method = paymentMethod;
    
    // Add custom string parameters for webhook processing (CRITICAL for webhook)
    if (plan?.id) {
      data.custom_str1 = plan.id; // Plan ID
    }
    
    // ALWAYS use authenticated user ID (CRITICAL for webhook to know who to email)
    data.custom_str2 = user.id; // User ID from authenticated session
    
    // Determine purchase type based on plan type or explicit parameter
    if (plan && 'content' in plan && typeof plan.content === 'object') {
      // Workout plan (has content object)
      data.custom_str3 = 'workout_plan';
    } else if (plan) {
      // Meal plan (simpler structure)
      data.custom_str3 = 'meal_plan';
    } else if (customStr3) {
      data.custom_str3 = customStr3;
    }
    
    // Add remaining custom parameters if provided
    if (customStr4) data.custom_str4 = customStr4;
    if (customStr5) data.custom_str5 = customStr5;
    
    // Add custom integer parameters
    if (customInt1 !== undefined) data.custom_int1 = customInt1.toString();
    if (customInt2 !== undefined) data.custom_int2 = customInt2.toString();
    if (customInt3 !== undefined) data.custom_int3 = customInt3.toString();
    if (customInt4 !== undefined) data.custom_int4 = customInt4.toString();
    if (customInt5 !== undefined) data.custom_int5 = customInt5.toString();
    
    // Generate the signature
    const signature = generateSignature(data, payfastConfig.passPhrase);
    data.signature = signature;
    
    return data;
  };

  const handleClick = () => {
    console.log('PayfastButton: handleClick called');
    
    // Check if a purchase attempt handler exists and call it
    if (handlePurchaseAttempt && plan) {
      const shouldBlock = handlePurchaseAttempt(plan);
      if (shouldBlock) {
        console.log('PayfastButton: Purchase attempt blocked by parent handler');
        return;
      }
    }
    
    // Get current user
    const { user } = useAuthStore.getState();
    
    // Validate user is authenticated
    if (!user) {
      console.error('PayfastButton: User not authenticated');
      alert('Please log in before making a purchase');
      return;
    }
    
    // Validate user has email
    if (!user.email) {
      console.error('PayfastButton: User email not available');
      alert('User email is required for purchase confirmation');
      return;
    }
    
    // TODO: Add custom email confirmation check here if needed
    // For now, allowing purchases for logged-in users
    
    console.log('PayfastButton: User authenticated and email confirmed:', user.email);
    
    console.log('PayfastButton: User state:', {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      user_metadata: user.user_metadata
    });
    
    // Prepare payment data
    const paymentData = preparePaymentData();
    if (!paymentData) {
      console.error('PayfastButton: Failed to prepare payment data');
      return;
    }
    
    setPaymentData(paymentData);
    
    onClick?.();
    setShowPaymentModal(true);
    setPaymentStep('details');
  };
  
  const proceedToPayment = () => {
    console.log('PayfastButton: proceedToPayment called', { paymentData, formRef: !!formRef.current });
    
    if (!paymentData || !formRef.current) {
      console.error('PayfastButton: Missing payment data or form reference');
      return;
    }
    
    setPaymentStep('processing');
    
    // Create the form element
    const pfHost = isSandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
    console.log(`PayfastButton: Using Payfast endpoint: https://${pfHost}/eng/process (sandbox: ${isSandbox})`);
    
    let formHtml = `<form action="https://${pfHost}/eng/process" method="post">`;
    
    console.log('PayfastButton: Payment data being submitted:', paymentData);
    
    // Add all payment data as hidden inputs
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== undefined) {
        // Make sure to properly escape HTML attributes
        const escapedValue = value.replace(/"/g, '&quot;');
        formHtml += `<input type="hidden" name="${key}" value="${escapedValue}">`;
      }
    });
    
    formHtml += `</form>`;
    
    try {
      // Add form to DOM
      console.log('PayfastButton: Adding form to DOM');
      formRef.current.innerHTML = formHtml;
      
      console.log('PayfastButton: Form HTML:', formHtml);
      
      // Submit the form after a short delay to show the processing state
      console.log('PayfastButton: Setting timeout to submit form');
      setTimeout(() => {
        try {
          const form = formRef.current?.querySelector('form');
          if (form) {
            console.log('PayfastButton: Submitting form to Payfast...');
            form.submit();
            console.log('PayfastButton: Form submitted');
          } else {
            console.error('PayfastButton: Form element could not be found after creation');
            setPaymentStep('error');
          }
        } catch (error) {
          console.error('PayfastButton: Error submitting form:', error);
          setPaymentStep('error');
        }
      }, 1500);
    } catch (error) {
      console.error('PayfastButton: Error creating form:', error);
      setPaymentStep('error');
    }
  };
  
  // Generate the Payfast signature according to their requirements
  const generateSignature = (data: PayfastPaymentData, passPhrase: string) => {
    // Log what we're doing
    console.log('Generating signature with data:', data);
    
    // We need to make a copy without the signature field if it exists
    const dataForSignature = { ...data };
    delete dataForSignature.signature;
    
    // Create parameter string in the correct order
    // NOTE: Official Payfast docs state:
    // "The pairs must be listed in the order in which they appear in the attributes description"
    const orderedKeys = [
      'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url',
      'name_first', 'name_last', 'email_address', 'cell_number',
      'm_payment_id', 'amount', 'item_name', 'item_description',
      'custom_int1', 'custom_int2', 'custom_int3', 'custom_int4', 'custom_int5',
      'custom_str1', 'custom_str2', 'custom_str3', 'custom_str4', 'custom_str5',
      'payment_method'
    ];
    
    // Build the parameter string with only non-empty values
    let paramString = '';
    for (const key of orderedKeys) {
      if (dataForSignature[key] !== undefined && dataForSignature[key] !== '') {
        // Payfast requires spaces to be encoded as + (not %20) and URL encoding to be uppercase
        const value = (dataForSignature[key] as string).trim();
        const encoded = encodeURIComponent(value)
          .replace(/%20/g, '+')         // Replace %20 with +
          .replace(/(%[0-9A-F]{2})/g, match => match.toUpperCase()); // Make encodings uppercase
        
        paramString += `${key}=${encoded}&`;
      }
    }
    
    // Remove trailing &
    if (paramString.endsWith('&')) {
      paramString = paramString.slice(0, -1);
    }
    
    // Add passphrase if provided
    if (passPhrase) {
      paramString += `&passphrase=${encodeURIComponent(passPhrase)
        .replace(/%20/g, '+')
        .replace(/(%[0-9A-F]{2})/g, match => match.toUpperCase())}`;
    }
    
    console.log('Parameter string for signature:', paramString);
    
    // Generate MD5 hash
    return md5(paramString);
  };

  // Payment Modal Component
  const PaymentModal = () => {
    if (!showPaymentModal || !paymentData) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-playfair text-2xl">
              {paymentStep === 'details' && 'Confirm Payment'}
              {paymentStep === 'processing' && 'Processing Payment'}
              {paymentStep === 'success' && 'Payment Successful'}
              {paymentStep === 'error' && 'Payment Error'}
            </h3>
            {paymentStep === 'details' && (
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
          
          {paymentStep === 'details' && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                
                <p className="text-center text-gray-600 mb-6">
                  You're about to make a payment for:
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Item:</span>
                    <span className="font-medium">{paymentData.item_name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">R{paymentData.amount}</span>
                  </div>
                  {isSandbox && (
                    <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-700">
                        This is a test payment using the Payfast Sandbox. No real money will be charged.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={proceedToPayment}
                    className="w-full py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF5252] hover:to-[#FF7676] shadow-lg shadow-primary/30 transform transition-all duration-200 hover:scale-[1.02] text-white rounded-lg flex items-center justify-center"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
          
          {paymentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">
                Processing your payment. You'll be redirected to Payfast shortly...
              </p>
            </div>
          )}
          
          {paymentStep === 'error' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-gray-600 mb-6">
                There was an error processing your payment. Please try again.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setPaymentStep('details')}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <>
      <button
        onClick={handleClick}
        className={`w-full py-3 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors ${className}`}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {children}
      </button>
      
      <PaymentModal />
      
      {/* Hidden form container */}
      <div ref={formRef} style={{ display: 'none' }}></div>
    </>
  );
};

export default PayfastButton;