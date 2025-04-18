// email-templates/admin/NewPurchaseNotification.tsx

type NewPurchaseNotificationProps = {
    userEmail: string;
    firstName: string;
    planName: string;
    purchaseDate: string;
  };
  
  export function NewPurchaseNotification({
    userEmail,
    firstName,
    planName,
    purchaseDate,
  }: NewPurchaseNotificationProps) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', padding: '20px' }}>
        <h2>🛍️ New Plan Purchase</h2>
  
        <p><strong>{firstName}</strong> ({userEmail}) just purchased a plan.</p>
  
        <table style={{ marginTop: '20px' }}>
          <tbody>
            <tr>
              <td><strong>Plan:</strong></td>
              <td>{planName}</td>
            </tr>
            <tr>
              <td><strong>Date:</strong></td>
              <td>{purchaseDate}</td>
            </tr>
          </tbody>
        </table>
  
        <p style={{ marginTop: '20px' }}>🎯 Keep track in the admin dashboard for more details.</p>
      </div>
    );
  }
  