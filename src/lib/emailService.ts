import ReactDOMServer from 'react-dom/server';
import { env } from './env';

type SendEmailParams = {
  to: string | string[];
  subject: string;
  reactTemplate: JSX.Element;
};

export async function sendEmail({
  to,
  subject,
  reactTemplate,
}: SendEmailParams) {
  const html = ReactDOMServer.renderToStaticMarkup(reactTemplate);

  try {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.supabase.anonKey}`,
      },
      body: JSON.stringify({
        to,
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Email send failed');
    }

    return data;
  } catch (err) {
    console.error('Unexpected error while sending email:', err);
    throw err;
  }
}
