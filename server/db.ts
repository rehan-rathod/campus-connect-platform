import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. Defaulting to dummy connection string for build purposes. The app will use in-memory storage.");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy",
});

export const db = drizzle(pool);
