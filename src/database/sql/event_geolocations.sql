CREATE TABLE IF NOT EXISTS event_geolocations (
    event_id UUID UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
