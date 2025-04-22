interface AdminCancelBookingEmailProps {
    bookingInfo: {
      name: string;
      email: string;
      date: string;
      time: string;
      bookingId: string;
    };
  }
  
  export const AdminCancelBookingEmail = ({ bookingInfo }: AdminCancelBookingEmailProps) => {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#FF6B6B' }}>
          <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>CANCELLED:</span> Personal Training Session
        </h2>
  
        <div style={{ backgroundColor: '#f9f9f9', borderLeft: '4px solid #e74c3c', padding: '15px', marginBottom: '20px' }}>
          <p><strong style={{ display: 'inline-block', width: '120px' }}>Name:</strong> {bookingInfo.name}</p>
          <p><strong style={{ display: 'inline-block', width: '120px' }}>Email:</strong> {bookingInfo.email}</p>
          <p><strong style={{ display: 'inline-block', width: '120px' }}>Original Date:</strong> {bookingInfo.date}</p>
          <p><strong style={{ display: 'inline-block', width: '120px' }}>Original Time:</strong> {bookingInfo.time}</p>
          <p><strong style={{ display: 'inline-block', width: '120px' }}>Booking ID:</strong> {bookingInfo.bookingId}</p>
        </div>
  
        <p>This booking has been cancelled and removed from the calendar.</p>
  
        <hr style={{ margin: '30px 0' }} />
        <p style={{ fontSize: '12px', color: '#888' }}>
          © {new Date().getFullYear()} Fit Mom Admin. All rights reserved.
        </p>
      </div>
    );
  };
  