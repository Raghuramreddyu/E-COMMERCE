-- Drop the database if it exists to start fresh
DROP DATABASE IF EXISTS pc_parts;

-- Create the database
CREATE DATABASE pc_parts;

-- Select the database to use
USE pc_parts;

-- User table (no changes)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with category
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(255) NOT NULL
);

-- Orders and order_items tables (no changes)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    public_order_id VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- New sample data for PC Parts
INSERT INTO products (name, description, price, image_url, slug, category) VALUES
('Core i9-13900K', '24 Cores & 32 Threads, up to 5.8 GHz, for high-end gaming and content creation.', 589.99, '/assets/images/cpu-i9.jpg', 'cpu-i9-13900k', 'CPU'),
('Ryzen 7 7800X3D', '8 Cores & 16 Threads with 3D V-Cache technology for ultimate gaming performance.', 449.00, '/assets/images/cpu-ryzen7.jpg', 'cpu-ryzen7-7800x3d', 'CPU'),
('ASUS ROG Maximus Z790', 'Top-tier motherboard for Intel 13th Gen CPUs with DDR5 support.', 699.99, '/assets/images/mobo-asus.jpg', 'mobo-asus-z790', 'Motherboard'),
('MSI B650 Tomahawk', 'Feature-rich motherboard for AMD Ryzen 7000 series CPUs.', 219.99, '/assets/images/mobo-msi.jpg', 'mobo-msi-b650', 'Motherboard'),
('Corsair Vengeance 32GB', '32GB (2x16GB) DDR5 6000MHz CL36 RAM kit.', 109.99, '/assets/images/ram-corsair.jpg', 'ram-corsair-32gb-ddr5', 'RAM'),
('G.Skill Trident Z5 32GB', '32GB (2x16GB) DDR5 6400MHz CL32 high-performance RGB RAM.', 124.99, '/assets/images/ram-gskill.jpg', 'ram-gskill-32gb-ddr5', 'RAM'),
('NVIDIA GeForce RTX 4090', 'The ultimate graphics card for 4K gaming and creative workloads.', 1599.99, '/assets/images/gpu-rtx4090.jpg', 'gpu-rtx-4090', 'Graphic Card'),
('AMD Radeon RX 7900 XTX', 'Flagship AMD GPU with 24GB of VRAM, excellent for gaming.', 999.99, '/assets/images/gpu-rx7900xtx.jpg', 'gpu-rx-7900xtx', 'Graphic Card'),
('Samsung 980 Pro 2TB', 'High-speed NVMe M.2 SSD with read speeds up to 7,000 MB/s.', 129.99, '/assets/images/ssd-samsung.jpg', 'ssd-samsung-980-pro-2tb', 'Storage'),
('Crucial P5 Plus 2TB', 'Great value NVMe M.2 SSD for gaming and general use.', 97.99, '/assets/images/ssd-crucial.jpg', 'ssd-crucial-p5-plus-2tb', 'Storage'),
('Corsair RM1000e', '1000W 80+ Gold fully modular power supply for high-end builds.', 179.99, '/assets/images/psu-corsair.jpg', 'psu-corsair-rm1000e', 'Power Supply'),
('SeaSonic FOCUS Plus 850W', '850W 80+ Gold fully modular PSU, known for reliability.', 159.95, '/assets/images/psu-seasonic.jpg', 'psu-seasonic-focus-850w', 'Power Supply'),
('Lian Li O11 Dynamic EVO', 'A beautiful and popular mid-tower ATX case with great airflow.', 169.99, '/assets/images/case-lianli.jpg', 'case-lianli-o11-evo', 'Cabinet'),
('Fractal Design Meshify C', 'A compact ATX case with a high-airflow mesh front panel.', 99.99, '/assets/images/case-fractal.jpg', 'case-fractal-meshify-c', 'Cabinet');