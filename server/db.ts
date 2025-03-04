import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Create the connection using environment variables
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create the connection client
const client = postgres(connectionString, { 
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10
});

// Create the Drizzle database instance
export const db = drizzle(client, { schema });

// Test the connection by executing a simple query
async function testConnection() {
  try {
    const result = await client`SELECT 1`;
    console.log('Successfully connected to PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
}

// Run the connection test
testConnection();

export { client };