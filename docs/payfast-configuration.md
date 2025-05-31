# PayFast Payment Integration Configuration

## 🔐 PayFast Account Settings

### Merchant Details
- **Merchant ID**: `16614570`
- **Merchant Key**: `brqoi1x66yxqd`

### Security Settings
- **Security Passphrase**: `Fitness321sdf`
- **Purpose**: Extra security for payment signatures
- **Note**: Adding a passphrase automatically enables subscriptions

### Notification Settings
- **ITN Status**: ✅ **Enabled**
- **Notify URL**: `https://qnnmlclobwtgbgxpewri.supabase.co/functions/v1/payfast-webhook`
- **Implementation**: ✅ **Active Supabase Edge Function**

### Payment Page Settings
- **Require Signature**: ❌ **Disabled**

## 🛠️ Environment Variables Setup

### For Development (.env.local)
```env
# PayFast Configuration
VITE_PAYFAST_MERCHANT_ID=16614570
VITE_PAYFAST_MERCHANT_KEY=brqoi1x66yxqd
VITE_PAYFAST_PASSPHRASE=Fitness321sdf
VITE_PAYFAST_SANDBOX=true

# Supabase
VITE_SUPABASE_URL=https://qnnmlclobwtgbgxpewri.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### For Production (Vercel Dashboard)
```env
# PayFast Production
VITE_PAYFAST_MERCHANT_ID=16614570
VITE_PAYFAST_MERCHANT_KEY=brqoi1x66yxqd
VITE_PAYFAST_PASSPHRASE=Fitness321sdf
VITE_PAYFAST_SANDBOX=false

# Supabase Production
VITE_SUPABASE_URL=https://qnnmlclobwtgbgxpewri.supabase.co
VITE_SUPABASE_ANON_KEY=production_anon_key
SUPABASE_SERVICE_ROLE_KEY=production_service_key
```

## 🔗 Integration Details

### Current Implementation Files
- **Environment Config**: `src/lib/env.ts`
- **PayFast Service**: `src/lib/payfast.ts`
- **PayFast Button**: `src/components/PayfastButton.tsx`
- **Webhook Function**: ✅ **`supabase/functions/payfast-webhook/index.ts`** (DEPLOYED)
- **Test Page**: `src/pages/PayfastTest.tsx`

### Webhook Configuration
- **Production URL**: `https://qnnmlclobwtgbgxpewri.supabase.co/functions/v1/payfast-webhook`
- **Status**: ✅ **ACTIVE** (Edge Function v2 deployed)
- **Security**: ✅ **JWT verification disabled for public access**
- **Features**:
  - ✅ PayFast signature validation
  - ✅ IP address validation (PayFast servers only)
  - ✅ Automatic database updates
  - ✅ Comprehensive error handling
  - ✅ Purchase record creation
  - ✅ Support for meal plans and workout plans

### Return URLs
- **Success**: `${window.location.origin}/payment/success`
- **Cancel**: `${window.location.origin}/payment/cancel`

## 🧪 Testing

### Test Page
Access the PayFast test page at: `/payfast-test`

### Test Payment
- **Amount**: R10.00
- **Description**: "Testing Payfast integration"
- **Environment**: Sandbox when `VITE_PAYFAST_SANDBOX=true`

### Webhook Testing
You can test the webhook directly:
```bash
curl -X POST https://qnnmlclobwtgbgxpewri.supabase.co/functions/v1/payfast-webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "payment_status=complete&pf_payment_id=123&merchant_id=16614570&signature=test"
```

## 🚀 Deployment Checklist

### Before Going Live
- [x] Deploy PayFast webhook Edge Function
- [x] Configure JWT verification settings
- [x] Update webhook URL in PayFast button
- [ ] Set `VITE_PAYFAST_SANDBOX=false` in production
- [ ] Verify all environment variables in Vercel dashboard
- [ ] Test payments in sandbox environment
- [ ] Update webhook URL in PayFast dashboard
- [ ] Test ITN notifications

### Security Best Practices
- [x] Never commit actual credentials to Git
- [x] Use `.env.local` for development (in .gitignore)
- [x] Set production variables in Vercel dashboard
- [x] Implement PayFast signature validation
- [x] Validate PayFast server IP addresses
- [ ] Monitor PayFast transaction logs
- [x] Implement proper error handling for failed payments

## 🔍 Troubleshooting

### Common Issues
1. **Missing Environment Variables**: Check Vercel dashboard settings
2. **Sandbox vs Production**: Verify `VITE_PAYFAST_SANDBOX` setting
3. **Invalid Signature**: Check passphrase matches exactly
4. **Webhook Failures**: Check Edge Function logs via Supabase dashboard

### Debug Information
- The PayFast test page shows current configuration
- Edge Function logs are available in Supabase Dashboard → Edge Functions → payfast-webhook
- All webhook calls are logged with detailed information

## 📞 PayFast Support
- **Website**: https://www.payfast.co.za
- **Support**: Contact PayFast support for account-specific issues
- **Documentation**: https://developers.payfast.co.za

---
**Last Updated**: 2025-01-31
**Configuration Status**: ✅ **Active with Deployed Webhook** 
**Webhook URL**: `https://qnnmlclobwtgbgxpewri.supabase.co/functions/v1/payfast-webhook` 