interface AdminWelcomeNotifyProps {
  firstName: string;
  email: string;
  signupDate?: string;
}

export const NewUserNotifyEmail = ({
  firstName,
  email,
  signupDate = new Date().toLocaleString(),
}: AdminWelcomeNotifyProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px' }}>
    <h2>📬 New User Signup</h2>
    <p><strong>Name:</strong> {firstName}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Signup Time:</strong> {signupDate}</p>

    <p style={{ marginTop: '20px' }}>
      Please review the user's account in the admin dashboard if needed.
    </p>

    <hr style={{ margin: '30px 0' }} />
    <p style={{ fontSize: '12px', color: '#888' }}>
      Automated notification from Acme system.
    </p>
  </div>
);
