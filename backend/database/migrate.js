const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'washtrack_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting database migration...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await client.query(schema);

    console.log('✅ Database migration completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - companies');
    console.log('   - users');
    console.log('   - otp_verifications');
    console.log('   - customers');
    console.log('   - services');
    console.log('   - expense_types');
    console.log('   - transactions');
    console.log('   - expenses');
    console.log('   - inventory');
    console.log('   - purchase_orders');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
