-- Insert sample users
INSERT INTO users (email, username, password_hash, first_name, last_name, role, is_active) VALUES
('admin@bidding.com', 'admin', '$2b$10$YourHashedPasswordHere1', 'Admin', 'User', 'admin', true),
('john@example.com', 'john_doe', '$2b$10$YourHashedPasswordHere2', 'John', 'Doe', 'user', true),
('jane@example.com', 'jane_smith', '$2b$10$YourHashedPasswordHere3', 'Jane', 'Smith', 'user', true),
('bob@example.com', 'bob_johnson', '$2b$10$YourHashedPasswordHere4', 'Bob', 'Johnson', 'user', true),
('alice@example.com', 'alice_brown', '$2b$10$YourHashedPasswordHere5', 'Alice', 'Brown', 'user', true);

-- Insert sample auctions
INSERT INTO auctions (title, description, category, starting_price, status, created_by, start_time, end_time, image_url) VALUES
('Vintage Rolex Watch', 'Beautiful vintage Rolex Submariner in excellent condition', 'Watches', 500.00, 'active', (SELECT id FROM users WHERE username = 'admin'), NOW() - INTERVAL '1 hour', NOW() + INTERVAL '23 hours', 'https://via.placeholder.com/400x300?text=Rolex+Watch'),
('Antique Oil Painting', 'Original 19th century landscape painting', 'Art', 1000.00, 'active', (SELECT id FROM users WHERE username = 'admin'), NOW() - INTERVAL '2 hours', NOW() + INTERVAL '22 hours', 'https://via.placeholder.com/400x300?text=Oil+Painting'),
('Rare Comic Book Collection', 'Complete first edition Marvel collection', 'Collectibles', 200.00, 'pending', (SELECT id FROM users WHERE username = 'admin'), NOW() + INTERVAL '2 hours', NOW() + INTERVAL '26 hours', 'https://via.placeholder.com/400x300?text=Comic+Books'),
('Vintage Camera', 'Leica M3 rangefinder camera from 1954', 'Electronics', 300.00, 'active', (SELECT id FROM users WHERE username = 'admin'), NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '23.5 hours', 'https://via.placeholder.com/400x300?text=Vintage+Camera'),
('Gold Coin Collection', 'Rare historical gold coins from around the world', 'Coins', 2000.00, 'pending', (SELECT id FROM users WHERE username = 'admin'), NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days', 'https://via.placeholder.com/400x300?text=Gold+Coins');

-- Insert sample bids
INSERT INTO bids (auction_id, user_id, bid_amount) VALUES
((SELECT id FROM auctions WHERE title = 'Vintage Rolex Watch' LIMIT 1), (SELECT id FROM users WHERE username = 'john_doe'), 550.00),
((SELECT id FROM auctions WHERE title = 'Vintage Rolex Watch' LIMIT 1), (SELECT id FROM users WHERE username = 'jane_smith'), 600.00),
((SELECT id FROM auctions WHERE title = 'Vintage Rolex Watch' LIMIT 1), (SELECT id FROM users WHERE username = 'bob_johnson'), 650.00),
((SELECT id FROM auctions WHERE title = 'Antique Oil Painting' LIMIT 1), (SELECT id FROM users WHERE username = 'alice_brown'), 1100.00),
((SELECT id FROM auctions WHERE title = 'Antique Oil Painting' LIMIT 1), (SELECT id FROM users WHERE username = 'jane_smith'), 1200.00),
((SELECT id FROM auctions WHERE title = 'Vintage Camera' LIMIT 1), (SELECT id FROM users WHERE username = 'bob_johnson'), 350.00),
((SELECT id FROM auctions WHERE title = 'Vintage Camera' LIMIT 1), (SELECT id FROM users WHERE username = 'john_doe'), 400.00);

-- Update auction highest bids
UPDATE auctions SET current_highest_bid = 650.00, current_highest_bidder_id = (SELECT id FROM users WHERE username = 'bob_johnson'), total_bids = 3 WHERE title = 'Vintage Rolex Watch';
UPDATE auctions SET current_highest_bid = 1200.00, current_highest_bidder_id = (SELECT id FROM users WHERE username = 'jane_smith'), total_bids = 2 WHERE title = 'Antique Oil Painting';
UPDATE auctions SET current_highest_bid = 400.00, current_highest_bidder_id = (SELECT id FROM users WHERE username = 'john_doe'), total_bids = 2 WHERE title = 'Vintage Camera';

-- Insert auction watchers
INSERT INTO auction_watchers (auction_id, user_id) VALUES
((SELECT id FROM auctions WHERE title = 'Vintage Rolex Watch' LIMIT 1), (SELECT id FROM users WHERE username = 'alice_brown')),
((SELECT id FROM auctions WHERE title = 'Antique Oil Painting' LIMIT 1), (SELECT id FROM users WHERE username = 'bob_johnson')),
((SELECT id FROM auctions WHERE title = 'Vintage Camera' LIMIT 1), (SELECT id FROM users WHERE username = 'jane_smith'));
