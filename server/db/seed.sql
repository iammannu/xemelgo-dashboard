-- Solution Types
INSERT INTO solution_types (name) VALUES
  ('Asset'),
  ('Inventory'),
  ('Work Order');

-- Locations
INSERT INTO locations (name) VALUES
  ('Storage 1'),
  ('Storage 2'),
  ('Storage 3'),
  ('Storage 4');

-- Users (password is 'password123' for all users)
INSERT INTO users (name, email, password, role) VALUES
  ('Tabitha Ryne', 'tabitha@xemelgo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  ('Jacob Eld', 'jacob@xemelgo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
  ('Claire Stroup', 'claire@xemelgo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
  ('Curtis Trak', 'curtis@xemelgo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Items (4 per solution type)
INSERT INTO items (name, solution_type_id, current_location_id, status) VALUES
  ('Item 1', 1, 1, 'active'),
  ('Item 2', 1, 2, 'active'),
  ('Item 3', 1, 3, 'active'),
  ('Item 4', 1, NULL, 'missing'),
  ('Item 5', 2, 2, 'active'),
  ('Item 6', 2, 4, 'active'),
  ('Item 7', 2, 3, 'active'),
  ('Item 8', 2, NULL, 'consumed'),
  ('Item 9', 3, 1, 'active'),
  ('Item 10', 3, 4, 'active'),
  ('Item 11', 3, 4, 'active'),
  ('Item 12', 3, 2, 'active');

-- Location History
INSERT INTO location_history (item_id, location_id, timestamp) VALUES
  (1, 1, NOW() - INTERVAL '5 days'),
  (1, 2, NOW() - INTERVAL '3 days'),
  (1, 3, NOW() - INTERVAL '1 day'),
  (1, 1, NOW()),
  (2, 2, NOW() - INTERVAL '4 days'),
  (2, 1, NOW() - INTERVAL '2 days'),
  (2, 2, NOW()),
  (3, 1, NOW() - INTERVAL '6 days'),
  (3, 3, NOW() - INTERVAL '2 days'),
  (3, 3, NOW()),
  (4, 2, NOW() - INTERVAL '3 days'),
  (4, 1, NOW() - INTERVAL '1 day'),
  (5, 2, NOW() - INTERVAL '5 days'),
  (5, 4, NOW() - INTERVAL '2 days'),
  (5, 2, NOW()),
  (6, 1, NOW() - INTERVAL '4 days'),
  (6, 4, NOW()),
  (7, 3, NOW() - INTERVAL '3 days'),
  (7, 3, NOW()),
  (8, 2, NOW() - INTERVAL '2 days'),
  (8, 4, NOW() - INTERVAL '1 day'),
  (9, 1, NOW() - INTERVAL '5 days'),
  (9, 2, NOW() - INTERVAL '2 days'),
  (9, 1, NOW()),
  (10, 3, NOW() - INTERVAL '4 days'),
  (10, 4, NOW()),
  (11, 1, NOW() - INTERVAL '3 days'),
  (11, 4, NOW()),
  (12, 2, NOW() - INTERVAL '2 days'),
  (12, 2, NOW());

-- Action History
INSERT INTO action_history (item_id, user_id, action, timestamp) VALUES
  (1, 1, 'Moved', NOW() - INTERVAL '5 days'),
  (1, 2, 'Moved', NOW() - INTERVAL '3 days'),
  (1, 3, 'Moved', NOW() - INTERVAL '1 day'),
  (1, 1, 'Moved', NOW()),
  (2, 2, 'Moved', NOW() - INTERVAL '4 days'),
  (2, 4, 'Moved', NOW() - INTERVAL '2 days'),
  (2, 1, 'Moved', NOW()),
  (3, 3, 'Moved', NOW() - INTERVAL '6 days'),
  (3, 2, 'Moved', NOW() - INTERVAL '2 days'),
  (3, 4, 'Moved', NOW()),
  (4, 1, 'Moved', NOW() - INTERVAL '3 days'),
  (4, 2, 'Missing', NOW() - INTERVAL '1 day'),
  (5, 3, 'Scanned', NOW() - INTERVAL '5 days'),
  (5, 1, 'Scanned', NOW() - INTERVAL '2 days'),
  (5, 4, 'Scanned', NOW()),
  (6, 2, 'Scanned', NOW() - INTERVAL '4 days'),
  (6, 3, 'Scanned', NOW()),
  (7, 1, 'Scanned', NOW() - INTERVAL '3 days'),
  (7, 4, 'Scanned', NOW()),
  (8, 2, 'Scanned', NOW() - INTERVAL '2 days'),
  (8, 3, 'Consumed', NOW() - INTERVAL '1 day'),
  (9, 4, 'Received', NOW() - INTERVAL '5 days'),
  (9, 1, 'Received', NOW() - INTERVAL '2 days'),
  (9, 2, 'Received', NOW()),
  (10, 3, 'Received', NOW() - INTERVAL '4 days'),
  (10, 4, 'Received', NOW()),
  (11, 1, 'Received', NOW() - INTERVAL '3 days'),
  (11, 2, 'Received', NOW()),
  (12, 3, 'Received', NOW() - INTERVAL '2 days'),
  (12, 4, 'Complete', NOW());
