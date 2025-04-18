// email-templates/user/PurchaseConfirmation.tsx

type PurchaseConfirmationProps = {
    firstName: string;
    planName: string;
    downloadLink: string;
    purchaseDate: string;
  };
  
  export function PurchaseConfirmationEmail({
    firstName,
    planName,
    downloadLink,
    purchaseDate,
  }: PurchaseConfirmationProps) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', padding: '20px' }}>
        <h2>🎉 Thank you for your purchase, {firstName}!</h2>
        <p>We're excited to have you on board with the <strong>{planName}</strong> plan.</p>
  
        <table style={{ marginTop: '20px' }}>
          <tbody>
            <tr>
              <td><strong>Plan:</strong></td>
              <td>{planName}</td>
            </tr>
            <tr>
              <td><strong>Dowanload Link:</strong></td>
              <td>{downloadLink}</td>
            </tr>
            <tr>
              <td><strong>Purchase Date:</strong></td>
              <td>{purchaseDate}</td>
            </tr>
          </tbody>
        </table>
  
        <p style={{ marginTop: '30px' }}>If you have any questions, feel free to reply to this email.</p>
  
        <p>With love,<br/>The FitMomChloe Team 💪</p>
      </div>
    );
  }
  