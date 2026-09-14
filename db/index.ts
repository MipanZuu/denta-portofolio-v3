import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  const databaseUrl = process.env.DB_DATABASE_URL ?? process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DB_DATABASE_URL or DATABASE_URL.");
  }

  database ??= drizzle(databaseUrl, { schema });
  return database;
}
