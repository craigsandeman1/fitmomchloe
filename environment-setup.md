# Environment Variables Setup Guide

## 🔧 Quick Setup Instructions

### 1. Create `.env.local` file in project root:
```bash
# Copy this content to your .env.local file
# DO NOT commit .env.local to Git

# ===========================================
# PAYFAST CONFIGURATION
# ===========================================
VITE_PAYFAST_MERCHANT_ID=16614570
VITE_PAYFAST_MERCHANT_KEY=brqoi1x66yxqd
VITE_PAYFAST_PASSPHRASE=Fitness321sdf
VITE_PAYFAST_SANDBOX=true

# ===========================================
# SUPABASE CONFIGURATION  
# ===========================================
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. For Production (Vercel Dashboard):
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add these variables with **Production** scope:

```
VITE_PAYFAST_MERCHANT_ID = 16614570
VITE_PAYFAST_MERCHANT_KEY = brqoi1x66yxqd  
VITE_PAYFAST_PASSPHRASE = Fitness321sdf
VITE_PAYFAST_SANDBOX = false
```

## 🔐 PayFast Account Details (Reference)

### Merchant Account
- **Merchant ID**: `16614570`
- **Merchant Key**: `brqoi1x66yxqd`

### Security Configuration
- **Security Passphrase**: `Fitness321sdf`
- **Subscriptions**: ✅ Auto-enabled (due to passphrase)
- **Terms & Conditions**: ✅ Accepted

### Notification Settings
- **ITN Status**: ✅ **Enabled**
- **Current Notify URL**: `https://www.mysite.com/cart/notify-url`
- **App Implementation**: `https://webhooks.fitmomchloe.com/api/payfast-webhook`

### Security Settings
- **Require Signature**: ❌ **Disabled**

## ⚠️ Important Notes

### Development vs Production
- **Development**: Set `VITE_PAYFAST_SANDBOX=true`
- **Production**: Set `VITE_PAYFAST_SANDBOX=false`

### Webhook URL Update Required
The current webhook URL in the code needs to be updated:
- **Current**: `https://webhooks.fitmomchloe.com/api/payfast-webhook`
- **PayFast Dashboard**: `https://www.mysite.com/cart/notify-url`
- **Action Required**: Update one of these to match the other

### Security Checklist
- [ ] Never commit `.env` or `.env.local` files
- [ ] Verify `.env*` is in `.gitignore`
- [ ] Use Vercel dashboard for production variables
- [ ] Test in sandbox before going live
- [ ] Implement webhook handler for ITN notifications

## 🧪 Testing Setup

### Verify Configuration
1. Visit `/payfast-test` page
2. Check all environment variables are loaded
3. Test a R10.00 sandbox payment
4. Verify success/cancel flows work

### Expected Test Results
- ✅ Merchant ID: `16614570` displayed
- ✅ Merchant Key: Present (not shown)
- ✅ Passphrase: Present (not shown)  
- ✅ Sandbox Mode: True (for testing)

## 🚀 Going Live

### Pre-production Checklist
1. **Environment Variables**:
   - [ ] Set `VITE_PAYFAST_SANDBOX=false` in Vercel
   - [ ] Verify all production URLs are correct
   - [ ] Test production PayFast connection

2. **PayFast Dashboard**:
   - [ ] Update webhook URL to real endpoint
   - [ ] Verify ITN is enabled
   - [ ] Test notification flow

3. **Final Testing**:
   - [ ] Test real payment flow (small amount)
   - [ ] Verify webhook receives notifications
   - [ ] Check database updates correctly
   - [ ] Test refund process if needed

---
**Configuration Status**: ✅ **Ready for Implementation**
**Last Updated**: 2024-12-19 