-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own notifications
CREATE POLICY "Users can view their own notifications" 
    ON public.notifications 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow admin users to view all notifications
CREATE POLICY "Admin users can view all notifications" 
    ON public.notifications 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Allow the system to insert notifications
CREATE POLICY "System can insert notifications" 
    ON public.notifications 
    FOR INSERT 
    WITH CHECK (true);

-- Allow users to mark their notifications as read
CREATE POLICY "Users can update their own notifications" 
    ON public.notifications 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        -- Only allow updating is_read and updated_at columns
    );

-- Create a trigger to ensure only is_read can be updated
CREATE OR REPLACE FUNCTION check_notification_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure only is_read and updated_at can be modified
    IF (
        NEW.id != OLD.id OR
        NEW.user_id != OLD.user_id OR
        NEW.booking_id != OLD.booking_id OR
        NEW.message != OLD.message OR
        NEW.type != OLD.type OR
        NEW.created_at != OLD.created_at
    ) THEN
        RAISE EXCEPTION 'Only is_read and updated_at fields can be modified';
    END IF;
    
    -- Update the updated_at timestamp
    NEW.updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_notification_update_fields
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION check_notification_update();

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);

-- Create an index on booking_id for faster lookups
CREATE INDEX IF NOT EXISTS notifications_booking_id_idx ON public.notifications(booking_id); 