CREATE TABLE IF NOT EXISTS types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    CONSTRAINT unique_name UNIQUE (name)
);
