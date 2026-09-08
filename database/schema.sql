CREATE DATABASE IF NOT EXISTS cebu_store_locator;
USE cebu_store_locator;

CREATE TABLE IF NOT EXISTS stores (
    store_id INT AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    google_maps_link VARCHAR(500),
    website_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    stock INT NOT NULL DEFAULT 0,
    store_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_items_store
        FOREIGN KEY (store_id) REFERENCES stores(store_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Sample data (optional)
INSERT INTO stores (store_name, address, google_maps_link, website_link)
VALUES
('TechZone', 'Ayala Center Cebu, Cebu City', 'https://www.google.com/maps/search/?api=1&query=Ayala+Center+Cebu', 'https://techzone.ph'),
('Gamer''s Hub', 'Parkmall, Mandaue City', 'https://www.google.com/maps/search/?api=1&query=Parkmall+Mandaue', 'https://gamershub.ph'),
('SoundWave', 'Marina Mall, Lapu-Lapu City', 'https://www.google.com/maps/search/?api=1&query=Marina+Mall+Lapu-Lapu', 'https://soundwave.ph');

INSERT INTO items (item_name, description, stock, store_id)
SELECT 'Laptop Bag', 'Durable waterproof bag for 15-inch laptops', 10, store_id
FROM stores WHERE store_name = 'TechZone' LIMIT 1;

INSERT INTO items (item_name, description, stock, store_id)
SELECT 'Gaming Mouse', 'High precision RGB gaming mouse', 8, store_id
FROM stores WHERE store_name = 'Gamer''s Hub' LIMIT 1;

INSERT INTO items (item_name, description, stock, store_id)
SELECT 'Wireless Earbuds', 'Noise-cancelling Bluetooth earbuds', 5, store_id
FROM stores WHERE store_name = 'SoundWave' LIMIT 1;
