import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";

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
    }),
});

export const lockersTable = pgTable("lockers", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  locked: boolean("locked").default(false),
  combination: varchar("combination"),
});

export const linksTable = pgTable("links", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  url: text("url").notNull(),
  name: text("name").notNull(),
  locker_id: integer("locker_id").references(() => lockersTable.id, {
    onDelete: "cascade",
  }),
});

export const tagsTable = pgTable("tags", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  link_id: integer("link_id").references(() => linksTable.id, {
    onDelete: "cascade",
  }),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertToken = typeof tokensTable.$inferInsert;
export type SelectToken = typeof tokensTable.$inferSelect;

export type InsertLocker = typeof lockersTable.$inferInsert;
export type SelectLocker = typeof lockersTable.$inferSelect;

export type InsertLink = typeof linksTable.$inferInsert;
export type SelectLink = typeof linksTable.$inferSelect;

export type InsertTag = typeof tagsTable.$inferInsert;
export type SelectTag = typeof tagsTable.$inferSelect;
