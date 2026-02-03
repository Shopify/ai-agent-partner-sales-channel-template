import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// - DATABASE_URL: e.g. "file:dev.sqlite" (local)
export const url = process.env.DATABASE_URL ?? "file:dev.sqlite";

const client = createClient({ url });

export const db = drizzle(client, { schema });

export default db;
