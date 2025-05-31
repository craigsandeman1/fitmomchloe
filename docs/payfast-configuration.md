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
- **Notify URL**: `https://www.mysite.com/cart/notify-url`
- **Current Implementation**: `https://webhooks.fitmomchloe.com/api/payfast-webhook`

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
VITE_SUPABASE_URL=your_supabase_url
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
VITE_SUPABASE_URL=production_url
VITE_SUPABASE_ANON_KEY=production_anon_key
SUPABASE_SERVICE_ROLE_KEY=production_service_key
```

## 🔗 Integration Details

### Current Implementation Files
- **Environment Config**: `src/lib/env.ts`
- **PayFast Service**: `src/lib/payfast.ts`
- **PayFast Button**: `src/components/PayfastButton.tsx`
- **Test Page**: `src/pages/PayfastTest.tsx`

### Webhook Configuration
- **Current URL**: `https://webhooks.fitmomchloe.com/api/payfast-webhook`
- **Status**: ⚠️ **Placeholder** - needs real implementation
- **Purpose**: Receive payment notifications from PayFast

### Return URLs
- **Success**: `${window.location.origin}/payment-result?status=success`
- **Cancel**: `${window.location.origin}/payment-result?status=cancel`

## 🧪 Testing

### Test Page
Access the PayFast test page at: `/payfast-test`

### Test Payment
- **Amount**: R10.00
- **Description**: "Testing Payfast integration"
- **Environment**: Sandbox when `VITE_PAYFAST_SANDBOX=true`

## 🚀 Deployment Checklist

### Before Going Live
- [ ] Set `VITE_PAYFAST_SANDBOX=false` in production
- [ ] Verify all environment variables in Vercel dashboard
- [ ] Test payments in sandbox environment
- [ ] Implement proper webhook handler
- [ ] Update webhook URL in PayFast dashboard
- [ ] Test ITN notifications

### Security Best Practices
- [ ] Never commit actual credentials to Git
- [ ] Use `.env.local` for development (in .gitignore)
- [ ] Set production variables in Vercel dashboard
- [ ] Monitor PayFast transaction logs
- [ ] Implement proper error handling for failed payments

## 🔍 Troubleshooting

### Common Issues
1. **Missing Environment Variables**: Check Vercel dashboard settings
2. **Sandbox vs Production**: Verify `VITE_PAYFAST_SANDBOX` setting
3. **Invalid Signature**: Check passphrase matches exactly
4. **Webhook Failures**: Implement proper webhook handler

### Debug Information
The PayFast test page shows current configuration:
- Merchant ID
- Merchant Key presence
- Passphrase presence
- Sandbox mode status

## 📞 PayFast Support
- **Website**: https://www.payfast.co.za
- **Support**: Contact PayFast support for account-specific issues
- **Documentation**: https://developers.payfast.co.za

---
**Last Updated**: 2024-12-19
**Configuration Status**: ✅ **Active Production Settings** 