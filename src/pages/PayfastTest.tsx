import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PayfastButton from '../components/PayfastButton';
import { env } from '../lib/env';

const PayfastTestPage = () => {
  const [envValues, setEnvValues] = useState({
    merchantId: '',
    merchantKey: '',
    hasPassphrase: false,
    sandbox: false
  });
  
  const [validConfig, setValidConfig] = useState(false);
  
  useEffect(() => {
    // Display environment variables (without showing the passphrase)
    console.log('Environment values in Payfast test:', {
      merchantId: env.payfast.merchantId,
      merchantKey: env.payfast.merchantKey,
      hasPassphrase: !!env.payfast.passPhrase,
      sandbox: env.payfast.sandbox,
      // Log the environment object to check if variables are properly loaded
      import_meta_env: import.meta.env ? 'Available' : 'Not available'
      // process.env is not available in browser context with Vite
    });
    
    const envData = {
      merchantId: env.payfast.merchantId,
      merchantKey: env.payfast.merchantKey,
      hasPassphrase: !!env.payfast.passPhrase,
      sandbox: env.payfast.sandbox
    };
    
    setEnvValues(envData);
    
    // Check if config is valid (basic validation)
    const isValid = !!(
      envData.merchantId && 
      envData.merchantId.length > 5 && 
      envData.merchantKey && 
      envData.merchantKey.length > 5
    );
    
    setValidConfig(isValid);
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Payfast Integration Test</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Payfast Integration Test</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Merchant ID:</strong> {envValues.merchantId || 'Not set'}</li>
          <li><strong>Merchant Key:</strong> {envValues.merchantKey || 'Not set'}</li>
          <li><strong>Passphrase:</strong> {envValues.hasPassphrase ? 'Set (hidden)' : 'Not set'}</li>
          <li><strong>Sandbox Mode:</strong> {envValues.sandbox ? 'Enabled' : 'Disabled'}</li>
          <li><strong>Configuration Status:</strong> {validConfig ? 
            <span className="text-green-600 font-medium">Valid</span> : 
            <span className="text-red-600 font-medium">Invalid</span>}</li>
        </ul>
      </div>
      
      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Payment</h2>
        <p className="mb-4">This will test a R10.00 payment through Payfast.</p>
        
        {validConfig ? (
          <PayfastButton
            amount={10}
            itemName="Test Payment"
            itemDescription="Testing Payfast integration"
            email="test@example.com"
            firstName="Test"
            lastName="User"
            mPaymentId={`TEST-${Date.now()}`}
            customStr1="test-user-id"
            onSuccess={() => alert('Payment successful!')}
            onCancel={() => alert('Payment cancelled')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Make Test Payment (R10.00)
          </PayfastButton>
        ) : (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
            <p className="font-medium">Invalid Payfast Configuration</p>
            <p className="text-sm mt-1">Please check your environment variables and make sure you've set the correct Merchant ID and Merchant Key.</p>
          </div>
        )}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Debugging Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Open the browser console to see detailed logs about the payment process</li>
          <li>Check that all environment variables are correctly set in your .env file</li>
          <li>Verify that the passphrase matches exactly what's in your Payfast merchant account</li>
          <li>Ensure you're using the correct merchant ID and key</li>
          <li>For Vite apps, make sure all environment variables start with VITE_</li>
        </ul>
      </div>
    </div>
  );
};

export default PayfastTestPage; 