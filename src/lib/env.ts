// Environment variable access
// In browser context, we can only access import.meta.env (Vite)
// In server context (Next.js API routes), we would use process.env

const isBrowser = typeof window !== 'undefined';

export const env = {
  // Payfast configuration
  payfast: {
    merchantId: isBrowser 
      ? import.meta.env.VITE_PAYFAST_MERCHANT_ID || '' 
      : '',
    merchantKey: isBrowser 
      ? import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '' 
      : '',
    passPhrase: isBrowser 
      ? import.meta.env.VITE_PAYFAST_PASSPHRASE || '' 
      : '',
    sandbox: isBrowser 
      ? import.meta.env.VITE_PAYFAST_SANDBOX === 'true' 
      : false,
  },
  
  // Supabase configuration
  supabase: {
    url: isBrowser 
      ? import.meta.env.VITE_SUPABASE_URL || '' 
      : '',
    anonKey: isBrowser 
      ? import.meta.env.VITE_SUPABASE_ANON_KEY || '' 
      : '',
    serviceKey: isBrowser 
      ? import.meta.env.VITE_SUPABASE_SERVICE_KEY || '' 
      : '',
  },
}; 