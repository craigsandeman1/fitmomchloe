
interface WelcomeEmailProps {
  firstName: string;
}

export const WelcomeEmail = ({ firstName }: WelcomeEmailProps) => {
  return (
      <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px' }}>
        <h2>Welcome to Acme, {firstName} 👋</h2>
        <p>We're thrilled to have you on board.</p>
        <p>
          Get started by exploring your dashboard, setting up your profile, and discovering everything Acme
          has to offer.
        </p>
        <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
        <hr style={{ margin: '30px 0' }} />
        <p style={{ fontSize: '12px', color: '#888' }}>
          © {new Date().getFullYear()} Acme Inc. All rights reserved.
        </p>
      </div>
    );
} 
