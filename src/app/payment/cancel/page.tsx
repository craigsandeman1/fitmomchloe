'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Post a message to the parent window
    window.opener?.postMessage({ type: 'PAYFAST_CANCEL' }, window.location.origin);
    
    // Redirect to the meal plans page after 5 seconds
    const timer = setTimeout(() => {
      router.push('/meal-plans');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No worries, you can try again anytime.
        </p>
        <div className="space-y-4">
          <Link
            href="/meal-plans"
            className="w-full block py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Return to Meal Plans
          </Link>
          <p className="text-sm text-gray-500">
            You will be redirected automatically in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
} 