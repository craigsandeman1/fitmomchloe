interface AdminBookingNotificationEmailProps {
    booking: {
      name: string;
      date: string;
      time: string;
      notes?: string;
    };
  }
  
export const AdminBookingNotificationEmail = ({ booking }: AdminBookingNotificationEmailProps) => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#FF6B6B' }}>📋 New Training Session Booked</h2>

        <div style={{ backgroundColor: '#f9f9f9', borderLeft: '4px solid #2196F3', padding: '15px', marginBottom: '20px' }}>
            <p><strong style={{ width: '100px', display: 'inline-block' }}>Client Name:</strong> {booking.name}</p>
            <p><strong style={{ width: '100px', display: 'inline-block' }}>Date:</strong> {booking.date}</p>
            <p><strong style={{ width: '100px', display: 'inline-block' }}>Time:</strong> {booking.time}</p>
            <p><strong style={{ width: '100px', display: 'inline-block' }}>Notes:</strong> {booking.notes || 'None'}</p>
        </div>

        <p>Please prepare accordingly for the upcoming session.</p>
        <p>Access the admin dashboard to view or manage the booking.</p>

        <hr style={{ margin: '30px 0' }} />
        <p style={{ fontSize: '12px', color: '#888' }}>
            © {new Date().getFullYear()} Fit Mom Admin. All rights reserved.
        </p>
        </div>
    );
};
  