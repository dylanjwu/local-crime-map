CREATE TABLE IF NOT EXISTS officers (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    CONSTRAINT unique_full_name UNIQUE (first_name, last_name)
);