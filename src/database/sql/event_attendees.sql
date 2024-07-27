CREATE TABLE IF NOT EXISTS event_attendees (
    attendee_id UUID PRIMARY KEY,
    event_id UUID UNIQUE REFERENCES events(event_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    registration_name VARCHAR(255) NOT NULL,
    attendee_status VARCHAR(50), -- e.g., 'going', 'interested'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
