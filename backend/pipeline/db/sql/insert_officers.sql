INSERT INTO officers (first_name, last_name) 
    SELECT first, last
 FROM jsonb_to_recordset(${officers}::JSONB) as name(first TEXT, last TEXT) ON CONFLICT DO NOTHING;