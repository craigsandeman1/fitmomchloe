# Deploying to Vercel with PayFast Integration

This guide will walk you through deploying your application to Vercel with proper PayFast integration.

## Prerequisites

- A Vercel account linked to your GitHub/GitLab/Bitbucket account
- A PayFast merchant account
- Your Supabase credentials

## Step 1: Prepare your repository

Make sure your repository contains the following files:

- `vercel.json` - Contains the routing configuration for API endpoints
- `/api/payfast-notify.js` - The serverless function to handle PayFast notifications
- `/api/payment-status.js` - The serverless function to check payment status

## Step 2: Set up Vercel project

1. Log in to your Vercel account and create a new project
2. Import your GitHub/GitLab/Bitbucket repository
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Step 3: Configure environment variables

Add the following environment variables to your Vercel project settings:

- `VITE_SUPABASE_URL` - Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_PAYFAST_MERCHANT_ID` - Your PayFast merchant ID
- `VITE_PAYFAST_MERCHANT_KEY` - Your PayFast merchant key
- `VITE_PAYFAST_PASSPHRASE` - Your PayFast passphrase (if configured)

Make sure to use production values for production deployments!

## Step 4: Deploy your project

1. Click "Deploy" to deploy your project
2. Once deployment is complete, you'll get a deployment URL (e.g., `https://your-project.vercel.app`)

## Step 5: Update PayFast settings

In your PayFast merchant account, update your notification URLs:

- Return URL: `https://your-project.vercel.app/payment/success`
- Cancel URL: `https://your-project.vercel.app/payment/cancelled`
- Notify URL: `https://your-project.vercel.app/api/payfast/notify`

## Step 6: Enable secure notification handling

For production, you should enable signature validation in the `/api/payfast-notify.js` file:

1. Find the commented section with signature validation
2. Uncomment it to enable proper security checks

## Step 7: Test the integration

1. Make a test purchase on your site
2. Verify that the PayFast process works end-to-end
3. Check Vercel logs for any errors in the serverless functions

## Troubleshooting

### Payment successful but purchase not updated

Check the following:

1. Vercel function logs for any errors
2. Make sure your notification URL is correct and accessible
3. Verify that the PayFast IP addresses are allowed in any firewall settings

### Error: "Invalid signature"

Make sure the passphrase in your Vercel environment variables exactly matches your PayFast account passphrase.

## Going Live

Before going live:

1. Switch from PayFast sandbox to production
2. Update your merchant ID and key to production values
3. Test a complete transaction flow
4. Monitor your first few real transactions closely

## Resources

- [PayFast Integration Documentation](https://developers.payfast.co.za/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Supabase Documentation](https://supabase.io/docs) 