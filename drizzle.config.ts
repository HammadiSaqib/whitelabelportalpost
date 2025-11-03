import { defineConfig } from "drizzle-kit";

if (!process.env.PGHOST) {
  throw new Error("Database credentials not found. Ensure the database is provisioned.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || "5432"),
    user: process.env.PGUSER!,
    password: process.env.PGPASSWORD!,
    database: process.env.PGDATABASE!,
    ssl: true,
  },
});
