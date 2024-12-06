CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION pgcrypto;

CREATE TABLE users (
    user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    role VARCHAR(15) NOT NULL,
    birthdate DATE NOT NULL,
    terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_token UUID UNIQUE DEFAULT uuid_generate_v4(),
    CHECK (role IN ('reserver', 'administrator'))
);

CREATE TABLE resources (
    resource_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    resource_name VARCHAR(100) NOT NULL,
    resource_description TEXT
);

CREATE TABLE reservations (
    reservation_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reserver_token UUID REFERENCES users(user_token) ON DELETE CASCADE,
    reservation_start TIMESTAMPTZ NOT NULL,
    reservation_end TIMESTAMPTZ NOT NULL,
    resource_id INT NOT NULL,
    FOREIGN KEY (resource_id) REFERENCES resources (resource_id),
    CHECK (reservation_end > reservation_start)
);

-- CREATE TABLE zephyr_admin_logs (
--     log_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--     admin_id INT NOT NULL REFERENCES zephyr_users(user_id),
--     action VARCHAR(255) NOT NULL,
--     resource_id INT,
--     reservation_id INT,
--     timestamp TIMESTAMP DEFAULT NOW()
-- );

CREATE OR REPLACE FUNCTION check_age() RETURNS TRIGGER AS $$
BEGIN
    IF (EXTRACT(YEAR FROM AGE(NEW.reservation_start, (SELECT birthdate FROM users WHERE user_token = NEW.reserver_token))) < 15) THEN
        RAISE EXCEPTION 'User must be over 15 years old to make a reservation';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER check_age_trigger
BEFORE INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION check_age();

CREATE VIEW booked_resources_view AS
SELECT
    r.resource_name,
    res.reservation_start,
    res.reservation_end
FROM resources r
JOIN reservations res ON r.resource_id = res.resource_id;

-- CREATE OR REPLACE FUNCTION erase_user(user_id_to_erase INT) RETURNS VOID AS $$
-- DECLARE
--     user_token_to_erase UUID;
-- BEGIN
--     SELECT user_token INTO user_token_to_erase FROM zephyr_users WHERE user_id = user_id_to_erase;

--     DELETE FROM zephyr_reservations WHERE reserver_token = user_token_to_erase;
--     DELETE FROM zephyr_users WHERE user_id = user_id_to_erase;
    
--     DELETE FROM zephyr_admin_logs WHERE admin_id = user_id_to_erase;
-- END;
-- $$ LANGUAGE plpgsql;

CREATE TABLE login_logs (
    log_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    login_timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_token UUID NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    FOREIGN KEY (user_token) REFERENCES users (user_token) ON DELETE CASCADE
);