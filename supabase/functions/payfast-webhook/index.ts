import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// PayFast ITN (Instant Transaction Notification) Webhook Handler
// This function receives payment notifications from PayFast and processes them

interface PayFastITNData {
  m_payment_id: string;
  pf_payment_id: string;
  payment_status: string;
  item_name: string;
  item_description?: string;
  amount_gross: string;
  amount_fee: string;
  amount_net: string;
  custom_str1?: string; // Plan ID
  custom_str2?: string; // User ID
  custom_str3?: string; // Purchase type (meal_plan or workout_plan)
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  merchant_id: string;
  signature: string;
  [key: string]: string | undefined;
}

// Valid PayFast server IPs for security validation
const validPayFastIPs = [
  '197.97.145.144',
  '41.74.179.194',
  '197.97.145.145',
  '41.74.179.195'
];

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// MD5 hash function
async function md5(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate PayFast signature for validation
async function generateSignature(data: Record<string, string | undefined>, passPhrase?: string): Promise<string> {
  // Remove signature from data for validation
  const dataForSignature = { ...data };
  delete dataForSignature.signature;
  
  // Create parameter string in correct order
  const orderedKeys = [
    'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url',
    'name_first', 'name_last', 'email_address', 'cell_number',
    'm_payment_id', 'amount', 'item_name', 'item_description',
    'custom_int1', 'custom_int2', 'custom_int3', 'custom_int4', 'custom_int5',
    'custom_str1', 'custom_str2', 'custom_str3', 'custom_str4', 'custom_str5',
    'payment_method', 'pf_payment_id', 'payment_status', 'amount_gross', 'amount_fee', 'amount_net'
  ];
  
  const params = orderedKeys
    .filter(key => dataForSignature[key] !== undefined && dataForSignature[key] !== '')
    .map(key => `${key}=${encodeURIComponent(dataForSignature[key]!)}`)
    .join('&');
  
  const paramString = passPhrase ? `${params}&passphrase=${encodeURIComponent(passPhrase)}` : params;
  
  console.log('PayFast signature generation:', {
    paramString: paramString.replace(/passphrase=[^&]*/, 'passphrase=[HIDDEN]'),
    originalData: Object.keys(dataForSignature)
  });
  
  return await md5(paramString);
}

// Validate PayFast signature
async function validateSignature(data: PayFastITNData): Promise<boolean> {
  const passPhrase = Deno.env.get('PAYFAST_PASSPHRASE') || Deno.env.get('VITE_PAYFAST_PASSPHRASE');
  const expectedSignature = await generateSignature(data, passPhrase);
  
  console.log('PayFast signature validation:', {
    received: data.signature,
    expected: expectedSignature,
    match: data.signature === expectedSignature
  });
  
  return data.signature === expectedSignature;
}

// Validate request source (PayFast IP addresses)
function validateSource(request: Request): boolean {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const connectingIP = request.headers.get('cf-connecting-ip');
  
  const clientIP = forwarded?.split(',')[0] || realIP || connectingIP;
  
  console.log('PayFast source validation:', {
    clientIP,
    forwarded,
    realIP,
    connectingIP,
    validIPs: validPayFastIPs
  });
  
  // In development/testing, we might not have the correct IP
  if (Deno.env.get('ENVIRONMENT') === 'development') {
    console.log('Development mode: Skipping IP validation');
    return true;
  }
  
  return clientIP ? validPayFastIPs.includes(clientIP) : false;
}

// Process successful payment
async function processPayment(data: PayFastITNData): Promise<void> {
  const planId = data.custom_str1;
  const userId = data.custom_str2;
  const purchaseType = data.custom_str3; // 'meal_plan' or 'workout_plan'
  
  console.log('Processing payment:', {
    planId,
    userId,
    purchaseType,
    paymentId: data.pf_payment_id,
    amount: data.amount_gross,
    status: data.payment_status
  });
  
  if (!planId || !userId || !purchaseType) {
    throw new Error('Missing required payment data: planId, userId, or purchaseType');
  }
  
  // Determine the correct table based on purchase type
  const tableName = purchaseType === 'meal_plan' ? 'meal_plan_purchases' : 'workout_plan_purchases';
  
  // Create purchase record
  const purchaseData = {
    user_id: userId,
    plan_id: planId,
    payment_id: data.pf_payment_id,
    payment_status: data.payment_status,
    amount_paid: parseFloat(data.amount_gross),
    amount_fee: parseFloat(data.amount_fee),
    amount_net: parseFloat(data.amount_net),
    payment_method: 'payfast',
    transaction_details: {
      m_payment_id: data.m_payment_id,
      pf_payment_id: data.pf_payment_id,
      item_name: data.item_name,
      item_description: data.item_description,
      email_address: data.email_address,
      name_first: data.name_first,
      name_last: data.name_last,
      merchant_id: data.merchant_id,
      processed_at: new Date().toISOString()
    }
  };
  
  // Insert purchase record
  const { data: insertedData, error: insertError } = await supabase
    .from(tableName)
    .insert(purchaseData)
    .select()
    .single();
  
  if (insertError) {
    console.error('Database insert error:', insertError);
    throw new Error(`Failed to record purchase: ${insertError.message}`);
  }
  
  console.log('Purchase recorded successfully:', insertedData);
  
  // Send confirmation email to user
  try {
    console.log('Sending purchase confirmation email...');
    
    // Get user's first name from payment data or email
    const userFirstName = data.name_first || data.email_address?.split('@')[0] || 'Customer';
    const userEmail = data.email_address;
    
    if (userEmail) {
      // Create download link (in production, this should be a secure, time-limited link)
      const downloadLink = `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/purchase-download/${planId}?user=${userId}`;
      
      // Call the send-email edge function
      const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          to: userEmail,
          subject: `🎉 Your ${data.item_name} is ready for download!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
              <div style="background: linear-gradient(135deg, #E6827C 0%, #D4756F 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Thank You for Your Purchase!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your ${purchaseType.replace('_', ' ')} is ready to download</p>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #374151; margin-top: 0;">Hi ${userFirstName}! 👋</h2>
                
                <p style="color: #6B7280; line-height: 1.6; margin: 16px 0;">
                  Thank you for purchasing <strong>${data.item_name}</strong>! Your payment has been successfully processed and your plan is ready for download.
                </p>
                
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #374151; margin-top: 0;">Purchase Details:</h3>
                  <ul style="color: #6B7280; margin: 0; padding-left: 20px;">
                    <li><strong>Plan:</strong> ${data.item_name}</li>
                    <li><strong>Amount Paid:</strong> R${data.amount_gross}</li>
                    <li><strong>Payment ID:</strong> ${data.pf_payment_id}</li>
                    <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${downloadLink}" style="display: inline-block; background: linear-gradient(135deg, #E6827C 0%, #D4756F 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    📥 Download Your Plan
                  </a>
                </div>
                
                <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 30px;">
                  <p style="color: #9CA3AF; font-size: 14px; margin: 0;">
                    You can always access your purchased plans by logging into your account at <a href="${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}" style="color: #E6827C;">fitmomchloe.com</a>
                  </p>
                  <p style="color: #9CA3AF; font-size: 14px; margin: 10px 0 0 0;">
                    Questions? Reply to this email or contact us anytime.
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Fit Mom Chloe. All rights reserved.
                </p>
              </div>
            </div>
          `
        })
      });
      
      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        console.log('Purchase confirmation email sent successfully:', emailResult);
      } else {
        const emailError = await emailResponse.text();
        console.error('Failed to send purchase confirmation email:', emailError);
      }
    } else {
      console.warn('No email address provided in payment data, skipping email notification');
    }
    
    // Send admin notification
    const adminEmails = Deno.env.get('VITE_ADMIN_EMAILS')?.split(',') || ['admin@fitmomchloe.com'];
    
    if (adminEmails.length > 0) {
      const adminEmailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          to: adminEmails,
          subject: `💰 New Purchase: ${data.item_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>New Purchase Notification</h2>
              <p><strong>Customer:</strong> ${userFirstName} (${userEmail})</p>
              <p><strong>Plan:</strong> ${data.item_name}</p>
              <p><strong>Amount:</strong> R${data.amount_gross}</p>
              <p><strong>Payment ID:</strong> ${data.pf_payment_id}</p>
              <p><strong>Date:</strong> ${new Date().toISOString()}</p>
              <p><strong>Purchase Type:</strong> ${purchaseType}</p>
            </div>
          `
        })
      });
      
      if (adminEmailResponse.ok) {
        console.log('Admin notification sent successfully');
      } else {
        console.error('Failed to send admin notification');
      }
    }
    
  } catch (emailError) {
    console.error('Error sending emails:', emailError);
    // Don't fail the webhook if email sending fails
  }
}

Deno.serve(async (req: Request) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  console.log('PayFast webhook received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });
  
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }
    
    // Validate request source (PayFast IP)
    if (!validateSource(req)) {
      console.warn('PayFast webhook: Invalid source IP');
      return new Response('Forbidden', { 
        status: 403,
        headers: corsHeaders 
      });
    }
    
    // Parse form data (PayFast sends application/x-www-form-urlencoded)
    const formData = await req.formData();
    const data: Partial<PayFastITNData> = {};
    
    for (const [key, value] of formData.entries()) {
      data[key as keyof PayFastITNData] = value.toString();
    }
    
    // Validate required fields
    if (!data.pf_payment_id || !data.payment_status || !data.merchant_id || !data.signature) {
      return new Response('Missing required fields', { 
        status: 400,
        headers: corsHeaders 
      });
    }
    
    console.log('PayFast ITN data received:', {
      payment_id: data.pf_payment_id,
      status: data.payment_status,
      amount: data.amount_gross,
      merchant_id: data.merchant_id,
      custom_data: {
        plan_id: data.custom_str1,
        user_id: data.custom_str2,
        purchase_type: data.custom_str3
      }
    });
    
    // Validate signature
    const isValidSignature = await validateSignature(data as PayFastITNData);
    if (!isValidSignature) {
      console.error('PayFast webhook: Invalid signature');
      return new Response('Invalid signature', { 
        status: 400,
        headers: corsHeaders 
      });
    }
    
    // Validate merchant ID
    const expectedMerchantId = Deno.env.get('PAYFAST_MERCHANT_ID') || Deno.env.get('VITE_PAYFAST_MERCHANT_ID');
    if (data.merchant_id !== expectedMerchantId) {
      console.error('PayFast webhook: Invalid merchant ID', {
        received: data.merchant_id,
        expected: expectedMerchantId
      });
      return new Response('Invalid merchant ID', { 
        status: 400,
        headers: corsHeaders 
      });
    }
    
    // Process based on payment status
    switch (data.payment_status?.toLowerCase()) {
      case 'complete':
        await processPayment(data as PayFastITNData);
        console.log('Payment processed successfully');
        break;
        
      case 'failed':
      case 'cancelled':
        console.log('Payment failed or cancelled:', {
          status: data.payment_status,
          payment_id: data.pf_payment_id
        });
        // You might want to record failed payments too
        break;
        
      default:
        console.log('Unknown payment status:', data.payment_status);
        break;
    }
    
    // PayFast expects a 200 OK response
    return new Response('OK', { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    });
    
  } catch (error) {
    console.error('PayFast webhook error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}); 