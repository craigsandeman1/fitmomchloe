interface ContactFormEmailProps {
    formData: {
      name: string;
      email: string;
      subject?: string;
      message: string;
    };
  }
  
  export const ContactFormEmail = ({ formData }: ContactFormEmailProps) => {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#FF6B6B', marginBottom: '20px' }}>
          New Contact Form Submission
        </h1>
  
        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <p><strong style={{ marginRight: '10px' }}>Name:</strong> {formData.name}</p>
          <p><strong style={{ marginRight: '10px' }}>Email:</strong> {formData.email}</p>
          <p><strong style={{ marginRight: '10px' }}>Subject:</strong> {formData.subject || 'Not specified'}</p>
        </div>
  
        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <p><strong style={{ marginRight: '10px' }}>Message:</strong></p>
          <p style={{ whiteSpace: 'pre-line' }}>{formData.message}</p>
        </div>
  
        <hr style={{ margin: '30px 0' }} />
        <p style={{ fontSize: '12px', color: '#888' }}>
          © {new Date().getFullYear()} Fit Mom Website. All rights reserved.
        </p>
      </div>
    );
  };
  