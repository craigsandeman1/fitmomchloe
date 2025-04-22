interface UserBookingConfirmationEmailProps {
    booking: {
      name: string;
      date: string;
      time: string;
      notes?: string;
    };
  }
  
export const UserBookingConfirmationEmail = ({ booking }: UserBookingConfirmationEmailProps) => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#FF6B6B' }}>
            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>CONFIRMED:</span> Your Personal Training Session
        </h2>

        <div style={{ backgroundColor: '#f9f9f9', borderLeft: '4px solid #4CAF50', padding: '15px', marginBottom: '20px' }}>
            <p><strong style={{ width: '100px', display: 'inline-block' }}>Name:</strong> {booking.name}</p>
            <p><strong style={{ width: '100px', display: 'inline-block' }}>Date:</strong> {booking.date}</p>
            <p><strong style={{ width: '100px', display: 'inline-block' }}>Time:</strong> {booking.time}</p>
            <p><strong style={{ width: '100px', display: 'inline-block' }}>Notes:</strong> {booking.notes || 'None'}</p>
        </div>

        <p>Your booking has been confirmed! Looking forward to seeing you.</p>
        <p>Please arrive 5-10 minutes early to prepare for your session.</p>
        <p>If you need to cancel or reschedule, please do so at least 24 hours in advance.</p>

        <hr style={{ margin: '30px 0' }} />
        <p style={{ fontSize: '12px', color: '#888' }}>
            © {new Date().getFullYear()} Fit Mom. All rights reserved.
        </p>
        </div>
    );
};
  