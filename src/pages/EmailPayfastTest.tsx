import React, { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { env } from '../lib/env';
import { sendEmail } from '../lib/emailService';
import PayfastButton from '../components/PayfastButton';
import { PurchaseConfirmationEmail } from '../email-templates/user/purchaseConfirmEmail';
import { NewPurchaseNotification } from '../email-templates/admin/newPurchaseNotifyEmail';
import { CheckCircle, AlertCircle, Mail, CreditCard, Settings, RefreshCw } from 'lucide-react';

const EmailPayfastTest = () => {
  const { user } = useAuthStore();
  const [emailResult, setEmailResult] = useState<any>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState(user?.email || '');
  const [paymentResult, setPaymentResult] = useState<any>(null);

  // Test email functionality
  const testEmailService = async () => {
    if (!testEmailAddress) {
      alert('Please enter a test email address');
      return;
    }

    setEmailLoading(true);
    setEmailResult(null);

    try {
      // Test purchase confirmation email
      const result = await sendEmail({
        to: testEmailAddress,
        subject: '🧪 Test Email - Purchase Confirmation',
        reactTemplate: PurchaseConfirmationEmail({
          firstName: 'Test User',
          planName: 'Test Meal Plan',
          downloadLink: window.location.origin + '/test-download',
          purchaseDate: new Date().toLocaleString()
        })
      });

      setEmailResult({
        success: true,
        data: result,
        message: 'Email sent successfully!'
      });

      console.log('Email test result:', result);
    } catch (error) {
      console.error('Email test error:', error);
      setEmailResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Email sending failed'
      });
    } finally {
      setEmailLoading(false);
    }
  };

  // Test admin notification email
  const testAdminEmail = async () => {
    if (!testEmailAddress) {
      alert('Please enter a test email address');
      return;
    }

    setEmailLoading(true);
    setEmailResult(null);

    try {
      const result = await sendEmail({
        to: testEmailAddress,
        subject: '🧪 Test Email - Admin Notification',
        reactTemplate: NewPurchaseNotification({
          firstName: 'Test Customer',
          userEmail: testEmailAddress,
          planName: 'Test Meal Plan',
          purchaseDate: new Date().toLocaleString()
        })
      });

      setEmailResult({
        success: true,
        data: result,
        message: 'Admin notification email sent successfully!'
      });

      console.log('Admin email test result:', result);
    } catch (error) {
      console.error('Admin email test error:', error);
      setEmailResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Admin email sending failed'
      });
    } finally {
      setEmailLoading(false);
    }
  };

  // Mock plan for testing
  const testPlan = {
    id: 'test-plan-123',
    title: 'Test PayFast Integration',
    description: 'This is a test purchase to verify PayFast sandbox integration',
    price: 10.00,
    content: {
      weeks: []
    }
  } as any; // Type assertion to bypass strict typing for test

  const handlePaymentSuccess = (planId: string) => {
    setPaymentResult({
      success: true,
      planId,
      message: 'Payment completed successfully!',
      timestamp: new Date().toISOString()
    });
    console.log('Payment test successful:', planId);
  };

  const handlePaymentCancel = () => {
    setPaymentResult({
      success: false,
      message: 'Payment was cancelled',
      timestamp: new Date().toISOString()
    });
    console.log('Payment cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-8">
            <h1 className="text-3xl font-bold text-white">
              Email & PayFast Integration Test
            </h1>
            <p className="text-primary-light mt-2">
              Test email delivery and PayFast sandbox payments
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Configuration Status */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-blue-600" />
                Configuration Status
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* PayFast Configuration */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">PayFast Settings</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merchant ID:</span>
                      <span className="font-mono">{env.payfast.merchantId || '❌ Not Set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merchant Key:</span>
                      <span className="font-mono">
                        {env.payfast.merchantKey ? '✅ Set' : '❌ Not Set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passphrase:</span>
                      <span className="font-mono">
                        {env.payfast.passPhrase ? '✅ Set' : '❌ Not Set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sandbox Mode:</span>
                      <span className={`font-semibold ${env.payfast.sandbox ? 'text-green-600' : 'text-red-600'}`}>
                        {env.payfast.sandbox ? '✅ ENABLED' : '❌ DISABLED'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supabase Configuration */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Supabase Settings</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">URL:</span>
                      <span className="font-mono">
                        {env.supabase.url ? '✅ Set' : '❌ Not Set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Anon Key:</span>
                      <span className="font-mono">
                        {env.supabase.anonKey ? '✅ Set' : '❌ Not Set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Webhook URL:</span>
                      <span className="font-mono text-xs">
                        {`${env.supabase.url}/functions/v1/payfast-webhook`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sandbox Mode Warning */}
              {env.payfast.sandbox ? (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      PayFast Sandbox Mode Active
                    </span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    No real money will be charged. Test payments will be processed through PayFast sandbox.
                  </p>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">
                      PayFast Production Mode Active
                    </span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    ⚠️ Real money will be charged! Set VITE_PAYFAST_SANDBOX=true for testing.
                  </p>
                </div>
              )}
            </div>

            {/* Email Testing */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2 text-purple-600" />
                Email Service Test
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Email Address
                  </label>
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Enter email address to test"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={testEmailService}
                    disabled={emailLoading || !testEmailAddress}
                    className="btn-primary flex items-center"
                  >
                    {emailLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    Test Purchase Email
                  </button>

                  <button
                    onClick={testAdminEmail}
                    disabled={emailLoading || !testEmailAddress}
                    className="btn-secondary flex items-center"
                  >
                    {emailLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    Test Admin Email
                  </button>
                </div>

                {emailResult && (
                  <div className={`p-4 rounded-lg ${emailResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center mb-2">
                      {emailResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      )}
                      <span className={`font-medium ${emailResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        {emailResult.message}
                      </span>
                    </div>
                    {emailResult.data && (
                      <div className="text-sm">
                        <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(emailResult.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    {emailResult.error && (
                      <p className="text-red-700 text-sm">
                        Error: {emailResult.error}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* PayFast Testing */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                PayFast Payment Test
              </h2>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium mb-2">Test Product</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Product:</span>
                      <span className="ml-2 font-medium">{testPlan.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Price:</span>
                      <span className="ml-2 font-medium">R{testPlan.price.toFixed(2)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Description:</span>
                      <span className="ml-2">{testPlan.description}</span>
                    </div>
                  </div>
                </div>

                <div className="max-w-xs">
                  <PayfastButton
                    plan={testPlan}
                    customStr2={user?.id || 'test-user'}
                    customStr3="meal_plan"
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  >
                    {env.payfast.sandbox ? '🧪 Test Payment (Sandbox)' : '💰 Live Payment'}
                  </PayfastButton>
                </div>

                {paymentResult && (
                  <div className={`p-4 rounded-lg ${paymentResult.success ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                    <div className="flex items-center mb-2">
                      {paymentResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                      )}
                      <span className={`font-medium ${paymentResult.success ? 'text-green-800' : 'text-orange-800'}`}>
                        {paymentResult.message}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Plan ID: {paymentResult.planId}</p>
                      <p>Timestamp: {paymentResult.timestamp}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Environment Setup Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">
                Environment Setup Instructions
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>For Local Development (.env.local):</strong></p>
                <pre className="bg-blue-100 p-2 rounded text-xs overflow-x-auto">
{`VITE_PAYFAST_MERCHANT_ID=16614570
VITE_PAYFAST_MERCHANT_KEY=brqoi1x66yxqd
VITE_PAYFAST_PASSPHRASE=Fitness321sdf
VITE_PAYFAST_SANDBOX=true
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key`}
                </pre>
                <p><strong>For Production (Vercel Dashboard):</strong></p>
                <p>Set VITE_PAYFAST_SANDBOX=false and ensure all other variables are configured.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPayfastTest; 