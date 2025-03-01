# PayFast Integration with Vercel Deployment Guide

This guide will help you set up your PayFast integration with your Vercel deployment to handle payments properly.

## Local Development vs Production

The main challenge with PayFast integration is that the notification URL must be accessible from the internet. During local development, your localhost is not accessible to PayFast servers, so we need to use different approaches for development and production.

### Solution Overview

1. For production: Use Vercel's serverless functions to handle PayFast notifications
2. For development: Use a webhook testing service (like webhook.site) to debug notifications

## Setting Up for Production

### 1. Vercel Environment Variables

Make sure to add all the required environment variables to your Vercel project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` 
- `VITE_PAYFAST_MERCHANT_ID`
- `VITE_PAYFAST_MERCHANT_KEY`
- `VITE_PAYFAST_PASSPHRASE`

### 2. Deploy to Vercel

Deploy your project to Vercel. The `vercel.json` file has already been set up to route API requests properly.

### 3. Update PayFast with Production URLs

In your PayFast merchant account, make sure to:

1. Set your notification URL to: `https://your-domain.vercel.app/api/payfast/notify`
2. Set your return URL to: `https://your-domain.vercel.app/payment/success`
3. Set your cancel URL to: `https://your-domain.vercel.app/payment/cancelled`

## Testing Locally

For local testing, you have a few options:

### Option 1: Use webhook.site (Recommended for development)

1. Go to [webhook.site](https://webhook.site/)
2. Copy your unique URL
3. Replace `'https://webhook.site/your-test-webhook-id'` in both the `handlePurchase` and `createTestPayment` functions
4. Make test purchases and check webhook.site for the notifications

### Option 2: Use ngrok (For more advanced testing)

1. Install ngrok: `npm install -g ngrok`
2. Start your local development server: `npm run dev`
3. In another terminal, run: `ngrok http 3000`
4. Copy the https URL provided by ngrok
5. Replace the webhook.site URL with your ngrok URL + `/api/payfast/notify`

## Troubleshooting

### Payment Successful but Purchase Not Updated

If payments seem to go through but your database isn't updating:

1. Check Vercel logs for any errors in the serverless function
2. Verify that your notification URL is correct and accessible
3. Check that your signature generation matches PayFast's requirements

### Testing in Sandbox Mode

Remember that in PayFast's sandbox environment:

- Use merchant ID: `10000100`
- Use merchant key: `46f0cd694581a`
- Use passphrase: `jt7NOE43FZPn` (if configured)
- Use test credit card: `5200 0000 0000 0000` with any future expiry date and CVV

## Production Checklist

Before going live:

1. Update the merchant ID, key, and passphrase to your real PayFast credentials
2. Remove any test buyer information and use the actual customer's details
3. Enable proper signature validation in the API endpoint
4. Test a complete transaction flow in the sandbox environment
5. Monitor your first few real transactions closely 