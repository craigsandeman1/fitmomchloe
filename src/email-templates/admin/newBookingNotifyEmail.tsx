interface AdminNewBookingNotifyEmailProps {
    bookingInfo: {
      name: string;
      email: string;
      date: string;
      time: string;
      notes?: string;
      bookingId: string;
    };
  }
  
export const AdminNewBookingNotifyEmail = ({ bookingInfo }: AdminNewBookingNotifyEmailProps) => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#FF6B6B', marginBottom: '20px' }}>New Personal Training Session Booked!</h2>

        <div style={{ backgroundColor: '#f9f9f9', borderLeft: '4px solid #FF6B6B', padding: '15px', marginBottom: '20px' }}>
            <p><strong style={{ display: 'inline-block', width: '100px' }}>Name:</strong> {bookingInfo.name}</p>
            <p><strong style={{ display: 'inline-block', width: '100px' }}>Email:</strong> {bookingInfo.email}</p>
            <p><strong style={{ display: 'inline-block', width: '100px' }}>Date:</strong> {bookingInfo.date}</p>
            <p><strong style={{ display: 'inline-block', width: '100px' }}>Time:</strong> {bookingInfo.time}</p>
            <p><strong style={{ display: 'inline-block', width: '100px' }}>Notes:</strong> {bookingInfo.notes || 'None'}</p>
            <p><strong style={{ display: 'inline-block', width: '100px' }}>Booking ID:</strong> {bookingInfo.bookingId}</p>
        </div>

        <p>This booking has been confirmed and added to your calendar.</p>

        <hr style={{ margin: '30px 0' }} />
        <p style={{ fontSize: '12px', color: '#888' }}>
            © {new Date().getFullYear()} Fit Mom Admin. All rights reserved.
        </p>
        </div>
    );
};
  