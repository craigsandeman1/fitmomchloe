import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from '../_shared/cors.ts';

interface EmailRequest {
  to: string | string[];
  subject: string;
  html: string;
}

Deno.serve(async (req: Request) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('Send email function called:', {
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

    const { to, subject, html }: EmailRequest = await req.json();

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: to, subject, html' 
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Sending email:', {
      to: Array.isArray(to) ? to : [to],
      subject,
      htmlLength: html.length
    });

    // Check if we have Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (resendApiKey) {
      // Use Resend service
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Fit Mom Chloe <noreply@fitmomchloe.com>',
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Resend API error:', result);
        throw new Error(`Resend API error: ${result.message || 'Unknown error'}`);
      }

      console.log('Email sent successfully via Resend:', result);

      return new Response(JSON.stringify({ 
        success: true,
        messageId: result.id,
        service: 'resend'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Mock email service for testing
      console.log('No email service configured - using mock service');
      console.log('MOCK EMAIL SENT:', {
        to: Array.isArray(to) ? to : [to],
        subject,
        htmlPreview: html.substring(0, 200) + '...'
      });

      return new Response(JSON.stringify({ 
        success: true,
        messageId: `mock-${Date.now()}`,
        service: 'mock',
        message: 'Email logged to console (mock service)'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

  } catch (error) {
    console.error('Send email error:', error);
    
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