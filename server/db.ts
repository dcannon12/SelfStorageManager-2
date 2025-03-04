import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

// Set up the connection config to match MySQL Workbench settings
const config = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'storage_manager_db',
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  waitForConnections: true,
  connectTimeout: 10000,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
};

// Create the connection pool with error handling
const pool = mysql.createPool(config);

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to MySQL database');
    // Execute a test query to ensure database exists
    return connection.query('SELECT 1')
      .then(() => {
        console.log('Database connection verified');
        connection.release();
      });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('Database does not exist. Please create it first.');
    }
    throw err;
  });

export { pool };
export const db = drizzle(pool, { schema, mode: 'default' });