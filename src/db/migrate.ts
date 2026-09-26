import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./db-client.js";

const runMigrations = async () => {
  console.log("Running Drizzle migrations from ./drizzle folder...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
