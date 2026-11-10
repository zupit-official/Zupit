import { pool } from './index.js';

async function migrate() {
  console.log('Connecting to PostgreSQL and running migrations...');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Enable extensions
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await client.query(`CREATE EXTENSION IF NOT EXISTS "postgis";`);

    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        phone VARCHAR(15) UNIQUE NOT NULL,
        name VARCHAR(100),
        email VARCHAR(100),
        role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'rider', 'merchant', 'admin')),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Merchants / Stores Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS merchants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        address_text TEXT NOT NULL,
        location GEOMETRY(Point, 4326),
        service_type VARCHAR(20) NOT NULL DEFAULT 'food' CHECK (service_type IN ('food', 'grocery')),
        is_active BOOLEAN DEFAULT TRUE,
        is_open BOOLEAN DEFAULT TRUE,
        banner_url TEXT,
        rating NUMERIC(2, 1) DEFAULT 4.5,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Spatial Index on Merchants
    await client.query(`
      CREATE INDEX IF NOT EXISTS merchants_location_idx ON merchants USING GIST(location);
    `);

    // Menu / Product Categories
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        sort_order INT DEFAULT 0
      );
    `);

    // Menu Items / Products
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        image_url TEXT,
        is_available BOOLEAN DEFAULT TRUE,
        is_veg BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_number SERIAL UNIQUE,
        customer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
        merchant_id UUID REFERENCES merchants(id) ON DELETE RESTRICT,
        rider_id UUID REFERENCES users(id) ON DELETE SET NULL,
        service_type VARCHAR(20) NOT NULL DEFAULT 'food' CHECK (service_type IN ('food', 'grocery')),
        items_json JSONB NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
        total_amount NUMERIC(10, 2) NOT NULL,
        payment_mode VARCHAR(20) NOT NULL DEFAULT 'cod' CHECK (payment_mode IN ('cod', 'online')),
        payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
        order_status VARCHAR(20) NOT NULL DEFAULT 'placed' CHECK (
          order_status IN ('placed', 'accepted', 'preparing', 'picked_up', 'delivered', 'cancelled')
        ),
        delivery_address_text TEXT NOT NULL,
        delivery_location GEOMETRY(Point, 4326),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Rides Table (for Bike Taxi phase)
    await client.query(`
      CREATE TABLE IF NOT EXISTS rides (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
        rider_id UUID REFERENCES users(id) ON DELETE SET NULL,
        pickup_address_text TEXT NOT NULL,
        pickup_location GEOMETRY(Point, 4326) NOT NULL,
        drop_address_text TEXT NOT NULL,
        drop_location GEOMETRY(Point, 4326) NOT NULL,
        fare_amount NUMERIC(10, 2) NOT NULL,
        ride_status VARCHAR(20) NOT NULL DEFAULT 'requested' CHECK (
          ride_status IN ('requested', 'accepted', 'arrived', 'ongoing', 'completed', 'cancelled')
        ),
        otp_code VARCHAR(6),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Migrations completed successfully! All tables and PostGIS spatial indices ready.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

