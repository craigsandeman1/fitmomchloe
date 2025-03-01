import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// PayFast signature calculation
const generateSignature = (data: Record<string, string>, passPhrase: string = '') => {
  // Remove signature from data if it exists
  const { signature, ...dataWithoutSignature } = data;

  // Create parameter string
  const paramString = Object.entries(dataWithoutSignature)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${encodeURIComponent(value.trim())}`)
    .join('&');

  // Add passphrase if it exists
  const stringToHash = paramString + (passPhrase ? `&passphrase=${encodeURIComponent(passPhrase)}` : '');

  // Generate MD5 hash
  return crypto.createHash('md5').update(stringToHash).digest('hex');
};

export async function POST(req: Request) {
  try {
    // Parse the request body
    const data = await req.formData();
    const payload = Object.fromEntries(data.entries());

    // Verify the request is from PayFast
    const signature = generateSignature(payload as Record<string, string>);
    if (signature !== payload.signature) {
      return new Response('Invalid signature', { status: 400 });
    }

    // Extract purchase ID from custom_str1
    const purchaseId = payload.custom_str1;
    if (!purchaseId) {
      return new Response('Missing purchase ID', { status: 400 });
    }

    // Get payment status
    const paymentStatus = payload.payment_status;
    const purchaseStatus = paymentStatus === 'COMPLETE' ? 'completed' : 'failed';

    // Update purchase record
    const { error: updateError } = await supabase
      .from('purchases')
      .update({
        status: purchaseStatus,
        payment_id: payload.pf_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', purchaseId);

    if (updateError) {
      console.error('Error updating purchase:', updateError);
      return new Response('Error updating purchase', { status: 500 });
    }

    // If payment was successful, we could trigger any additional actions here
    // like sending an email with the meal plan PDF

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing PayFast notification:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 