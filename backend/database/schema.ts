import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  username: text("username").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const tokensTable = pgTable("tokens", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  token: uuid("token").notNull().unique().defaultRandom(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertToken = typeof tokensTable.$inferInsert;
export type SelectToken = typeof tokensTable.$inferSelect;
