import { defineConfig } from "drizzle-kit";

// Use individual PG credentials for drizzle-kit since it uses node-postgres
const dbUrl = process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE
  ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`
  : process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL or PG credentials must be set");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
