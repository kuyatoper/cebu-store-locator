const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cebu_store_locator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL!');
    connection.release();
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    console.error('Make sure MySQL is running and the database exists.');
  }
}

testConnection();

module.exports = pool;
