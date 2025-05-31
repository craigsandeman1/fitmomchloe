# PayFast Sandbox Testing Setup Guide

## 🔐 PayFast Sandbox vs Live Credentials

### ⚠️ **IMPORTANT**: Sandbox and Live credentials are SEPARATE!

**❌ Common Mistake**: Using live merchant credentials with sandbox mode - this won't work!  
**✅ Correct Approach**: Use PayFast's dedicated sandbox credentials for testing.

## 🧪 PayFast Sandbox Test Credentials

### **Universal Sandbox Credentials** (Works for everyone)
```env
# PayFast SANDBOX Credentials - Use these for testing
VITE_PAYFAST_MERCHANT_ID=10000100
VITE_PAYFAST_MERCHANT_KEY=46f0cd694581a
VITE_PAYFAST_PASSPHRASE=jt7NOE43FZPn
VITE_PAYFAST_SANDBOX=true
```

### **Alternative**: Your Personal Sandbox Account
1. Visit: https://sandbox.payfast.co.za
2. Create a sandbox account (separate from your live account)
3. Get your specific sandbox credentials from the dashboard

## 🔧 Environment Configuration

### **For Testing (.env.local)**
```env
# ===========================================
# PAYFAST SANDBOX CONFIGURATION
# ===========================================
VITE_PAYFAST_MERCHANT_ID=10000100
VITE_PAYFAST_MERCHANT_KEY=46f0cd694581a
VITE_PAYFAST_PASSPHRASE=jt7NOE43FZPn
VITE_PAYFAST_SANDBOX=true

# ===========================================
# SUPABASE CONFIGURATION  
# ===========================================
VITE_SUPABASE_URL=https://qnnmlclobwtgbgxpewri.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ===========================================
# EMAIL SERVICE (OPTIONAL)
# ===========================================
RESEND_API_KEY=your_resend_key_if_you_have_one
VITE_ADMIN_EMAILS=admin@example.com
```

### **For Production (Vercel Dashboard)**
```env
# PayFast LIVE Credentials (your actual merchant account)
VITE_PAYFAST_MERCHANT_ID=16614570
VITE_PAYFAST_MERCHANT_KEY=brqoi1x66yxqd
VITE_PAYFAST_PASSPHRASE=Fitness321sdf
VITE_PAYFAST_SANDBOX=false
```

## 🎯 Testing Guidelines

### **Sandbox Mode Features**
- ✅ **No real money** charged
- ✅ **Test payments** complete successfully
- ✅ **Webhook notifications** still work
- ✅ **Database records** created normally
- ✅ **Email notifications** sent normally

### **Sandbox Payment Details**
- **Minimum Amount**: R5.00
- **Test Cards**: Any test card details work
- **Test Bank**: EFT payments can be tested
- **Environment**: sandbox.payfast.co.za

### **Test Payment Flow**
1. Your app redirects to: `https://sandbox.payfast.co.za/eng/process`
2. PayFast displays test payment page
3. Complete payment with test details
4. Webhook notification sent to your endpoint
5. User redirected back to your app

## 🔍 Configuration Verification

### **Check Your Setup**
Visit `/email-payfast-test` to verify:

**✅ Correct Sandbox Setup:**
```
Merchant ID: 10000100
Merchant Key: ✅ Set
Passphrase: ✅ Set
Sandbox Mode: ✅ ENABLED
```

**❌ Incorrect Setup (Live credentials in sandbox):**
```
Merchant ID: 16614570  ← Live credential!
Sandbox Mode: ✅ ENABLED  ← Mode correct but wrong credentials
```

## 🚨 Common Issues & Solutions

### **Issue**: "Invalid merchant details" error
**Solution**: Make sure you're using sandbox credentials (10000100) not live credentials (16614570)

### **Issue**: Payment redirects to live PayFast instead of sandbox
**Solution**: Verify `VITE_PAYFAST_SANDBOX=true` is set

### **Issue**: Webhook not receiving notifications
**Solution**: Check that webhook uses sandbox credentials for signature validation

### **Issue**: "Merchant not found" error
**Solution**: Ensure merchant ID is exactly `10000100` (no spaces)

## 🔄 Switching Between Modes

### **Development/Testing**: 
Always use sandbox credentials + `VITE_PAYFAST_SANDBOX=true`

### **Production**: 
Use your live credentials + `VITE_PAYFAST_SANDBOX=false`

### **Environment File Strategy**:
```bash
# Development - Always use .env.local (gitignored)
.env.local  # Sandbox credentials

# Production - Set in Vercel Dashboard
# Live credentials with VITE_PAYFAST_SANDBOX=false
```

## 📋 Pre-Testing Checklist

- [ ] Using sandbox credentials (10000100)
- [ ] `VITE_PAYFAST_SANDBOX=true` is set
- [ ] All environment variables loaded correctly
- [ ] Test page shows "✅ ENABLED" for sandbox mode
- [ ] Webhook URL points to your edge function
- [ ] Database tables exist for purchase recording

## 🧪 Test Transaction Details

### **Test with these parameters**:
- **Amount**: R10.00 (minimum R5.00)
- **Description**: "Test PayFast Integration"
- **Expected Flow**: 
  1. Redirect to sandbox.payfast.co.za
  2. Complete test payment
  3. Webhook receives notification
  4. Database record created
  5. Email sent (if configured)

---
**Next Steps**: Update your `.env.local` file with sandbox credentials and test again! 