import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../models/index.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("WARNING: DATABASE_URL environment variable is not defined.");
}

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, { schema });
