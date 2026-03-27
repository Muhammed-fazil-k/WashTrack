require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'washtrack_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function seed() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting database seeding...');

    await client.query('BEGIN');

    // 1. Create Super Admin
    console.log('Creating Super Admin...');
    await client.query(`
      INSERT INTO users (mobile_number, name, email, role, company_id, is_active)
      VALUES ($1, $2, $3, $4, NULL, true)
      ON CONFLICT (mobile_number) DO NOTHING
    `, ['+919999999999', 'Super Admin', 'superadmin@washtrack.com', 'super_admin']);

    // 2. Create Sample Companies
    console.log('Creating sample companies...');
    const company1 = await client.query(`
      INSERT INTO companies (company_code, name, contact_number, email, address, city, state, pincode, subscription_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      'WC0001',
      'Sparkle Car Wash',
      '+919876543210',
      'sparkle@carwash.com',
      '123 Main Street',
      'Mumbai',
      'Maharashtra',
      '400001',
      'active'
    ]);

    const company2 = await client.query(`
      INSERT INTO companies (company_code, name, contact_number, email, address, city, state, pincode, subscription_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      'WC0002',
      'Premium Auto Spa',
      '+919876543211',
      'premium@autospa.com',
      '456 Park Avenue',
      'Delhi',
      'Delhi',
      '110001',
      'active'
    ]);

    const companyId1 = company1.rows[0].id;
    const companyId2 = company2.rows[0].id;

    // 3. Create Company Admins
    console.log('Creating company admins...');
    await client.query(`
      INSERT INTO users (mobile_number, name, email, role, company_id, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (mobile_number) DO NOTHING
    `, ['+919111111111', 'Rajesh Kumar', 'rajesh@sparkle.com', 'company_admin', companyId1]);

    await client.query(`
      INSERT INTO users (mobile_number, name, email, role, company_id, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (mobile_number) DO NOTHING
    `, ['+919222222222', 'Priya Sharma', 'priya@premium.com', 'company_admin', companyId2]);

    // 4. Create Workers
    console.log('Creating workers...');
    await client.query(`
      INSERT INTO users (mobile_number, name, email, role, company_id, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (mobile_number) DO NOTHING
    `, ['+919333333333', 'Amit Singh', 'amit@sparkle.com', 'worker', companyId1]);

    await client.query(`
      INSERT INTO users (mobile_number, name, email, role, company_id, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (mobile_number) DO NOTHING
    `, ['+919444444444', 'Suresh Patel', 'suresh@sparkle.com', 'worker', companyId1]);

    await client.query(`
      INSERT INTO users (mobile_number, name, email, role, company_id, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (mobile_number) DO NOTHING
    `, ['+919555555555', 'Rahul Verma', 'rahul@premium.com', 'worker', companyId2]);

    // 5. Create Sample Services
    console.log('Creating sample services...');
    await client.query(`
      INSERT INTO services (company_id, name, description, base_price, duration_minutes, is_active)
      VALUES
        ($1, 'Basic Wash', 'Exterior wash with foam', 299.00, 30, true),
        ($1, 'Premium Wash', 'Exterior + Interior cleaning', 599.00, 60, true),
        ($1, 'Full Detailing', 'Complete detailing with wax', 1499.00, 120, true)
    `, [companyId1]);

    await client.query(`
      INSERT INTO services (company_id, name, description, base_price, duration_minutes, is_active)
      VALUES
        ($1, 'Express Wash', 'Quick exterior wash', 199.00, 20, true),
        ($1, 'Deluxe Package', 'Premium wash + wax', 899.00, 90, true),
        ($1, 'Ultimate Spa', 'Full detailing + coating', 2499.00, 180, true)
    `, [companyId2]);

    // 6. Create Sample Expense Types
    console.log('Creating expense types...');
    await client.query(`
      INSERT INTO expense_types (company_id, name, description, is_active)
      VALUES
        ($1, 'Cleaning Supplies', 'Soaps, shampoos, wax, etc.', true),
        ($1, 'Equipment Maintenance', 'Repairs and maintenance', true),
        ($1, 'Utilities', 'Water, electricity bills', true),
        ($1, 'Salaries', 'Employee salaries', true)
    `, [companyId1]);

    await client.query(`
      INSERT INTO expense_types (company_id, name, description, is_active)
      VALUES
        ($1, 'Cleaning Supplies', 'Soaps, shampoos, wax, etc.', true),
        ($1, 'Equipment Maintenance', 'Repairs and maintenance', true),
        ($1, 'Utilities', 'Water, electricity bills', true),
        ($1, 'Salaries', 'Employee salaries', true)
    `, [companyId2]);

    // 7. Create Sample Customers
    console.log('Creating sample customers...');
    await client.query(`
      INSERT INTO customers (company_id, name, mobile_number, email, total_visits, total_spent)
      VALUES
        ($1, 'John Doe', '+919123456789', 'john@example.com', 5, 2995.00),
        ($1, 'Jane Smith', '+919123456790', 'jane@example.com', 3, 1797.00)
    `, [companyId1]);

    await client.query('COMMIT');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin:');
    console.log('  Mobile: 9999999999 (enter 10 digits, +91 auto-added)');
    console.log('  Role: super_admin');
    console.log('\nCompany Admin (Sparkle Car Wash):');
    console.log('  Mobile: 9111111111');
    console.log('  Role: company_admin');
    console.log('\nCompany Admin (Premium Auto Spa):');
    console.log('  Mobile: 9222222222');
    console.log('  Role: company_admin');
    console.log('\nWorker (Sparkle Car Wash):');
    console.log('  Mobile: 9333333333 or 9444444444');
    console.log('  Role: worker');
    console.log('\nWorker (Premium Auto Spa):');
    console.log('  Mobile: 9555555555');
    console.log('  Role: worker');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  NOTE: Enter only 10 digits at login. +91 is automatically added.');
    console.log('    You will receive an OTP (check console in dev mode).');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
