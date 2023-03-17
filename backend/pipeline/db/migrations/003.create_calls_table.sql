CREATE TABLE IF NOT EXISTS calls (
    id BIGINT PRIMARY KEY,
    call_start TIMESTAMP NOT NULL,
    call_end TIMESTAMP NOT NULL,
    type_id INTEGER NOT NULL,
    call_location TEXT,
    officer_id INTEGER NOT NULL,
    FOREIGN KEY (type_id) REFERENCES types (id) ON DELETE CASCADE,
    FOREIGN KEY (officer_id) REFERENCES officers (id) ON DELETE CASCADE
);