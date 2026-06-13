import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. App will use in-memory storage.");
}

const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pool ? drizzle(pool) : (null as any);
