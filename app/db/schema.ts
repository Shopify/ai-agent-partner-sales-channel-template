import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  blob,
} from "drizzle-orm/sqlite-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

// Drizzle session table compatible with Shopify's Drizzle adapter
export const sessionTable = sqliteTable("Session", {
  id: text("id").primaryKey(),
  shop: text("shop").notNull(),
  state: text("state").notNull(),
  isOnline: integer("isOnline", { mode: "boolean" }).notNull().default(false),
  scope: text("scope"),
  expires: text("expires"),
  accessToken: text("accessToken"),
  userId: blob("userId", { mode: "bigint" }),
});

export type SessionRow = InferSelectModel<typeof sessionTable>;
export type NewSession = InferInsertModel<typeof sessionTable>;
