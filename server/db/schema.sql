CREATE TABLE IF NOT EXISTS solution_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
); -- store asset,inventory, wo

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
); -- storage 1,2,3,4.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
); -- who performs the action like Manan so on

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  solution_type_id INTEGER REFERENCES solution_types(id),
  current_location_id INTEGER REFERENCES locations(id),
  status VARCHAR(50) DEFAULT 'active'
); -- current state of the item like where it is and what type it is

CREATE TABLE IF NOT EXISTS location_history (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id),
  location_id INTEGER REFERENCES locations(id),
  timestamp TIMESTAMPTZ DEFAULT NOW()
); -- tracking the movement of item over time

CREATE TABLE IF NOT EXISTS action_history (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id),
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
); -- used to track who did this
