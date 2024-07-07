CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID PRIMARY KEY,
    event_id UUID UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    attendee_name VARCHAR(255) NOT NULL,
    status VARCHAR(50), -- e.g., 'going', 'interested', 'declined'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
