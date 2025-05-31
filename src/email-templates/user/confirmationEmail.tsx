import React from 'react';

interface ConfirmationEmailProps {
  firstName: string;
  confirmationUrl: string;
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = ({ 
  firstName, 
  confirmationUrl 
}) => {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#E6827C', 
            fontSize: '28px', 
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }}>
            Fit Mom Chloe
          </h1>
          <div style={{ 
            width: '50px', 
            height: '3px', 
            backgroundColor: '#E6827C', 
            margin: '10px auto' 
          }}></div>
        </div>

        {/* Main Content */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#333', 
            fontSize: '24px', 
            marginBottom: '20px' 
          }}>
            Confirm Your Email Address
          </h2>
          
          <p style={{ 
            color: '#666', 
            fontSize: '16px', 
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            Hi {firstName}! 👋
          </p>
          
          <p style={{ 
            color: '#666', 
            fontSize: '16px', 
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            Thanks for signing up for Fit Mom! To complete your registration and start your fitness journey with us, please confirm your email address by clicking the button below.
          </p>

          {/* Confirmation Button */}
          <div style={{ margin: '30px 0' }}>
            <a 
              href={confirmationUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#E6827C',
                color: 'white',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Confirm My Email
            </a>
          </div>

          <p style={{ 
            color: '#888', 
            fontSize: '14px', 
            marginTop: '20px',
            lineHeight: '1.5'
          }}>
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style={{ 
            color: '#E6827C', 
            fontSize: '14px',
            wordBreak: 'break-all',
            marginTop: '10px'
          }}>
            {confirmationUrl}
          </p>
        </div>

        {/* Additional Info */}
        <div style={{ 
          borderTop: '1px solid #eee', 
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: '#888', 
            fontSize: '12px',
            margin: '0 0 10px 0'
          }}>
            This confirmation link will expire in 24 hours.
          </p>
          
          <p style={{ 
            color: '#888', 
            fontSize: '12px',
            margin: '0'
          }}>
            If you didn't create an account with Fit Mom, you can safely ignore this email.
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          <p style={{ 
            color: '#666', 
            fontSize: '14px',
            margin: '0 0 10px 0'
          }}>
            Best regards,<br />
            The Fit Mom Team 💪
          </p>
          
          <p style={{ 
            color: '#888', 
            fontSize: '12px',
            margin: '0'
          }}>
            © 2025 Fit Mom Chloe. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}; 