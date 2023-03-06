CREATE TABLE IF NOT EXISTS calls (
    id INTEGER PRIMARY KEY,
    call_start TIMESTAMP NOT NULL,
    call_end TIMESTAMP NOT NULL,
    type_id INTEGER NOT NULL,
    call_location TEXT,
    officer_id INTEGER NOT NULL
);