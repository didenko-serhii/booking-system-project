CREATE TYPE public.role AS ENUM('reserver', 'admin');

CREATE TABLE IF NOT EXISTS reservations (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    user_id integer NOT NULL,
    resource_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS resources (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar NOT NULL,
    description text,
    hourly_rate numeric(4, 2) NOT NULL,
    user_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (hourly_rate > 0)
);

CREATE TABLE IF NOT EXISTS users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username varchar UNIQUE NOT NULL,
    password varchar NOT NULL,
    email varchar UNIQUE NOT NULL,
    age integer NOT NULL,
    role role DEFAULT 'reserver' NOT NULL,
    CHECK (age > 12)
);

CREATE OR REPLACE FUNCTION check_age() RETURNS TRIGGER AS $$
BEGIN
    IF ((SELECT age FROM users u WHERE u.id = NEW.user_id) < 15) THEN
        RAISE EXCEPTION 'User must be over 15 years old to make a reservation';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_age_trigger
BEFORE INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION check_age();
