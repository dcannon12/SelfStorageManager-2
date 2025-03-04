import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

// Function to parse database URL and return connection config
function getConnectionConfig() {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port || '3306'),
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1), // Remove leading '/'
      };
    } catch (error) {
      console.error('Error parsing DATABASE_URL:', error);
    }
  }

  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'storage_manager_db',
  };
}

const config = {
  ...getConnectionConfig(),
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  waitForConnections: true,
  connectTimeout: 10000,
  queueLimit: 0
};

// Create the connection pool with error handling
const pool = mysql.createPool(config);

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    throw err;
  });

export { pool };
export const db = drizzle(pool, { schema, mode: 'default' });