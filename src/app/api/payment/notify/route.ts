import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import md5 from 'md5';
import dotenv from 'dotenv';
import { env } from '../../../../lib/env';

// Load environment variables
dotenv.config();

// In a real-world Next.js API route, you'd use process.env directly
// But for compatibility with our existing code, we'll use the env utility

// Initialize Supabase client using environment variables
let supabase: SupabaseClient | null = null;
try {
  // For server-side, try to use process.env if available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.supabase.url;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.supabase.serviceKey;
  supabase = createClient(supabaseUrl, supabaseServiceKey);
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

// Payfast configuration
const PAYFAST_CONFIG = {
  merchantId: process.env.VITE_PAYFAST_MERCHANT_ID || env.payfast.merchantId,
  merchantKey: process.env.VITE_PAYFAST_MERCHANT_KEY || env.payfast.merchantKey,
  passPhrase: process.env.VITE_PAYFAST_PASSPHRASE || env.payfast.passPhrase,
  sandbox: process.env.VITE_PAYFAST_SANDBOX === 'true' || env.payfast.sandbox,
};

console.log('Notify API using Payfast config:', {
  merchantId: PAYFAST_CONFIG.merchantId,
  merchantKey: PAYFAST_CONFIG.merchantKey,
  hasPassphrase: !!PAYFAST_CONFIG.passPhrase,
  sandbox: PAYFAST_CONFIG.sandbox
});

// Valid Payfast IP addresses for notification validation
const VALID_PAYFAST_HOSTS = [
  'www.payfast.co.za',
  'sandbox.payfast.co.za',
  'w1w.payfast.co.za',
  'w2w.payfast.co.za'
];

export async function POST(request: NextRequest) {
  // First, respond with 200 to acknowledge receipt of the notification
  // This prevents Payfast from retrying
  const responseHeaders = new Headers();
  responseHeaders.append('Content-Type', 'text/plain');
  
  try {
    console.log('Received Payfast notification');
    
    // Parse form data
    const formData = await request.formData();
    const pfData: Record<string, string> = {};
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      pfData[key] = value.toString();
    }
    
    console.log('Payment notification data:', pfData);
    
    // 1. Verify IP address is from Payfast
    const referer = request.headers.get('referer');
    if (!referer) {
      console.error('Missing referer header');
      return new NextResponse('Invalid request - missing referer', { status: 400, headers: responseHeaders });
    }
    
    const refererUrl = new URL(referer);
    if (!VALID_PAYFAST_HOSTS.includes(refererUrl.hostname)) {
      console.error(`Invalid notification source: ${refererUrl.hostname}`);
      return new NextResponse('Invalid request source', { status: 403, headers: responseHeaders });
    }
    
    // 2. Verify payment data
    if (pfData['payment_status'] !== 'COMPLETE') {
      console.log(`Payment not complete: ${pfData['payment_status']}`);
      return new NextResponse('OK', { status: 200, headers: responseHeaders });
    }
    
    // 3. Verify signature if present
    if (pfData['signature']) {
      const calculatedSignature = calculateSignature(pfData);
      if (pfData['signature'] !== calculatedSignature) {
        console.error('Signature verification failed');
        return new NextResponse('Signature verification failed', { status: 400, headers: responseHeaders });
      }
    }
    
    // 4. Process the payment and update the database
    const mealPlanId = pfData['m_payment_id'];
    const userId = pfData['custom_str1']; // Assuming you pass user_id in custom_str1
    const amount = parseFloat(pfData['amount_gross'] || '0');
    const paymentId = pfData['pf_payment_id'];
    
    if (!mealPlanId || !userId) {
      console.error('Missing required payment data');
      return new NextResponse('Missing required payment data', { status: 400, headers: responseHeaders });
    }
    
    // Record the purchase in the database
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return new NextResponse('Database error', { status: 500, headers: responseHeaders });
    }
    
    const { error } = await supabase
      .from('purchases')
      .insert([
        {
          user_id: userId,
          meal_plan_id: mealPlanId,
          amount: amount,
          payment_id: paymentId,
          purchase_date: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error recording purchase:', error);
      return new NextResponse('Error recording purchase', { status: 500, headers: responseHeaders });
    }
    
    console.log(`Successfully recorded purchase for meal plan: ${mealPlanId} by user: ${userId}`);
    return new NextResponse('OK', { status: 200, headers: responseHeaders });
    
  } catch (error) {
    console.error('Error processing payment notification:', error);
    return new NextResponse('Internal Server Error', { status: 500, headers: responseHeaders });
  }
}

// Helper function to calculate signature
function calculateSignature(pfData: Record<string, string>) {
  // Create parameter string in order required by Payfast
  const pfParamString = Object.keys(pfData)
    .filter(key => key !== 'signature' && pfData[key] !== '')
    .sort() // For verification we sort alphabetically
    .map(key => `${key}=${encodeURIComponent(pfData[key].trim())}`)
    .join('&');
  
  // Add passphrase if set
  const passPhrase = PAYFAST_CONFIG.passPhrase;
  const stringToHash = passPhrase 
    ? `${pfParamString}&passphrase=${encodeURIComponent(passPhrase.trim())}`
    : pfParamString;
  
  return md5(stringToHash);
} 