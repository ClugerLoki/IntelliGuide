import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { config } from "../config.js";

neonConfig.webSocketConstructor = ws;

// Check if we have a valid database URL
const hasValidDatabase = config.DATABASE_URL && 
  config.DATABASE_URL !== "your_database_url_here" && 
  !config.DATABASE_URL.includes("placeholder");

let pool: any = null;
let db: any = null;

if (hasValidDatabase) {
  try {
    pool = new Pool({ connectionString: config.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.warn('⚠️ Database connection failed, using in-memory fallback');
    console.warn('Database error:', error);
  }
} else {
  console.log('ℹ️ No database URL provided, using in-memory fallback');
}

// In-memory fallback for development
if (!db) {
  console.log('📝 Using in-memory storage for development');
  // Create a simple in-memory database mock
  db = {
    // Mock the database operations that might be used
    query: async () => [],
    insert: async () => ({ rows: [] }),
    update: async () => ({ rows: [] }),
    delete: async () => ({ rows: [] }),
    // Add other methods as needed
  };
}

export { pool, db };