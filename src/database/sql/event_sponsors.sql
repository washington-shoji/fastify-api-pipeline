CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_sponsors (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, sponsor_id)
);
