// email-templates/user/passwordResetEmail.tsx

interface PasswordResetEmailProps {
  firstName: string;
  resetLink: string;
}

export function PasswordResetEmail({ firstName, resetLink }: PasswordResetEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', padding: '20px', backgroundColor: '#f6f9fc' }}>
      <div style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '40px', maxWidth: '600px', borderRadius: '8px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#E6827C', textAlign: 'center', margin: '0 0 30px 0' }}>
          Reset Your Password
        </h1>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333333', margin: '20px 0' }}>
          Hi {firstName || 'there'},
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333333', margin: '20px 0' }}>
          We received a request to reset your password for your Fit Mom Chloe account. 
          Click the button below to create a new password:
        </p>
        
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <a 
            href={resetLink}
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#E6827C',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            Reset Password
          </a>
        </div>
        
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666666', margin: '20px 0' }}>
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        
        <p style={{ 
          fontSize: '14px', 
          lineHeight: '1.6', 
          color: '#E6827C', 
          wordBreak: 'break-all',
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          margin: '10px 0 20px 0'
        }}>
          {resetLink}
        </p>
        
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666666', margin: '20px 0' }}>
          This link will expire in 24 hours for security reasons. If you didn't request this password reset, 
          you can safely ignore this email.
        </p>
        
        <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '30px 0' }} />
        
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#999999', textAlign: 'center', margin: '20px 0' }}>
          Best regards,<br />
          The Fit Mom Chloe Team
        </p>
        
        <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#cccccc', textAlign: 'center', margin: '20px 0' }}>
          This email was sent to you because you requested a password reset. 
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  );
} 