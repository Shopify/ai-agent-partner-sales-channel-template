import { defineConfig } from "drizzle-kit";
import { url } from "app/db";

export default defineConfig({
  schema: "./app/utils/schema.server.ts",
  out: "./drizzle",
  dialect: "sqlite",
  strict: true,
  verbose: true,
  dbCredentials: {
    url,
  },
});
