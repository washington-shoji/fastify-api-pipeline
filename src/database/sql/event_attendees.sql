CREATE TABLE IF NOT EXISTS attendees (
    id UUID PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(50), -- e.g., 'going', 'interested', 'declined'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, event_id)
);
