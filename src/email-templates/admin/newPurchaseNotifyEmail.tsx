// email-templates/admin/NewPurchaseNotification.tsx

interface NewPurchaseNotificationProps {
  firstName: string;
  userEmail: string;
  planName: string;
  purchaseDate: string;
  amount?: number;
  paymentId?: string;
}

export function NewPurchaseNotification({ 
  firstName, 
  userEmail, 
  planName, 
  purchaseDate,
  amount,
  paymentId
}: NewPurchaseNotificationProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', padding: '20px', backgroundColor: '#f6f9fc' }}>
      <div style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '40px', maxWidth: '600px', borderRadius: '8px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#E6827C', textAlign: 'center', margin: '0 0 30px 0' }}>
          🛒 New Purchase Alert
        </h1>
        
        <p style={{ fontSize: '16px', lineHeight: '1.4', color: '#484848', margin: '24px 0' }}>
          A new meal plan purchase has been completed on your Fit Mom Chloe platform.
        </p>
        
        <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '24px', margin: '32px 0', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', margin: '0 0 16px 0' }}>
            Purchase Details:
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ fontSize: '14px', fontWeight: '600', color: '#6c757d', padding: '8px 16px 8px 0', width: '140px' }}>
                  Customer:
                </td>
                <td style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500', padding: '8px 0' }}>
                  {firstName} ({userEmail})
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ fontSize: '14px', fontWeight: '600', color: '#6c757d', padding: '8px 16px 8px 0' }}>
                  Plan Purchased:
                </td>
                <td style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500', padding: '8px 0' }}>
                  {planName}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ fontSize: '14px', fontWeight: '600', color: '#6c757d', padding: '8px 16px 8px 0' }}>
                  Purchase Date:
                </td>
                <td style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500', padding: '8px 0' }}>
                  {purchaseDate}
                </td>
              </tr>
              {amount && (
                <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ fontSize: '14px', fontWeight: '600', color: '#6c757d', padding: '8px 16px 8px 0' }}>
                    Amount:
                  </td>
                  <td style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500', padding: '8px 0' }}>
                    R{amount.toFixed(2)}
                  </td>
                </tr>
              )}
              {paymentId && (
                <tr>
                  <td style={{ fontSize: '14px', fontWeight: '600', color: '#6c757d', padding: '8px 16px 8px 0' }}>
                    Payment ID:
                  </td>
                  <td style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500', padding: '8px 0' }}>
                    {paymentId}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <hr style={{ borderColor: '#e6ebf1', margin: '32px 0' }} />
        
        <p style={{ fontSize: '16px', lineHeight: '1.4', color: '#484848', margin: '24px 0' }}>
          The customer has received their confirmation email with download link. 
          You can manage purchases and customer interactions through your admin dashboard.
        </p>
        
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <a
            style={{
              backgroundColor: '#E6827C',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block',
              padding: '12px 24px',
            }}
            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/admin`}
          >
            View Admin Dashboard
          </a>
        </div>
        
        <hr style={{ borderColor: '#e6ebf1', margin: '32px 0' }} />
        
        <p style={{ color: '#8898aa', fontSize: '12px', lineHeight: '1.4', textAlign: 'center', margin: '32px 0' }}>
          This is an automated notification from Fit Mom Chloe.
          <br />
          Sent: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default NewPurchaseNotification;
  