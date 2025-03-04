import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse MySQL connection URL
const url = new URL(process.env.DATABASE_URL);
const connectionConfig = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.substring(1), // Remove leading '/'
  port: parseInt(url.port || '3306'),
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  waitForConnections: true,
  connectTimeout: 10000,
  queueLimit: 0
};

// Create the connection pool with error handling
const pool = mysql.createPool(connectionConfig);

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