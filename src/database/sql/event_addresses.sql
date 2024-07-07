CREATE TABLE IF NOT EXISTS event_addresses (
    id UUID PRIMARY KEY,
    event_id UUID UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    street VARCHAR(255),
    city_suburb VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
