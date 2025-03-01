import { useEffect, useRef } from 'react';
import { PayfastService } from '../lib/payfast';

interface PayfastButtonProps {
  amount: number;
  itemName: string;
  itemDescription?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  cellNumber?: string;
  mPaymentId?: string;
  paymentMethod?: 'cc' | 'dc' | 'ef' | 'mp' | 'mc' | 'sc' | 'ss' | 'zp' | 'mt' | 'rc' | 'mu' | 'ap' | 'sp' | 'cp';
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  children?: React.ReactNode;
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
  onSuccess,
  onCancel,
  className = 'btn-primary',
  children = 'Pay Now'
}: PayfastButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for payment success/cancel messages
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'PAYFAST_SUCCESS') {
        onSuccess?.();
      } else if (event.data.type === 'PAYFAST_CANCEL') {
        onCancel?.();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onCancel]);

  const handleClick = () => {
    const payfastService = new PayfastService({
      merchantId: '10000100', // Replace with your merchant ID
      merchantKey: '46f0cd694581a', // Replace with your merchant key
      passPhrase: 'jt7NOE43FZPn', // Replace with your passphrase
      returnUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancel`,
      notifyUrl: `${window.location.origin}/api/payment/notify`,
      paymentMethod,
      emailConfirmation: true,
      sandbox: true // Set to false in production
    });

    const formHtml = payfastService.generatePaymentForm({
      amount,
      itemName,
      itemDescription,
      email,
      firstName,
      lastName,
      cellNumber,
      mPaymentId
    });

    // Create a temporary container and set the form HTML
    if (containerRef.current) {
      containerRef.current.innerHTML = formHtml;
      
      // Get the form and submit it safely
      const form = containerRef.current.querySelector('form');
      if (form instanceof HTMLFormElement) {
        form.submit();
      }
    }
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className={className}
      >
        {children}
      </button>
      <div ref={containerRef} style={{ display: 'none' }} />
    </>
  );
};

export default PayfastButton;