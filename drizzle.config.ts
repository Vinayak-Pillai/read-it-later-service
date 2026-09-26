import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/models/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: [
    process.env.SCHEMA_NAME1 || "",
    process.env.SCHEMA_NAME2 || "",
  ],
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
