INSERT INTO types (name) SELECT unnest(${callTypes}) ON CONFLICT DO NOTHING;