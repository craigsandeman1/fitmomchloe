# Supabase Custom Email Templates

This folder contains custom email templates for Supabase authentication flows. These templates provide a consistent branded experience that matches the Web3Forms emails used in the rest of the application.

## Available Templates

1. **confirmation.html** - Used for email address confirmation
2. **reset-password.html** - Used for password reset requests  
3. **magic-link.html** - Used for passwordless login links

## How to Apply Templates to Supabase

You can set up these templates in your Supabase project through the Supabase dashboard:

1. Log in to the [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Go to **Authentication** in the sidebar
4. Click on **Email Templates**
5. For each template type (Confirmation, Recovery, Magic Link):
   - Click on the template type
   - Set the template type to "Custom"
   - Paste the HTML content from the corresponding .html file in this folder
   - Click "Save"

## Template Variables

Each template uses specific variables provided by Supabase:

- `{{ .ConfirmationURL }}` - The URL users need to click to confirm their action
- `{{ .SiteURL }}` - Your site's URL (set in Supabase Auth settings)

## Customization

If you need to further customize these templates:

1. Edit the HTML files in this folder
2. Update the templates in Supabase using the steps above
3. Test the emails by triggering a sign-up, password reset, or magic link request

## Important Notes

- **Template Size Limit**: Supabase has a limit of 60KB for each email template
- **Test After Changes**: Always test your email templates after making changes to ensure they work correctly
- **BCC Addresses**: Unlike Web3Forms emails, Supabase emails cannot automatically BCC other addresses 