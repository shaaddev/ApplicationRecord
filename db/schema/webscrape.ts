import { pgTable, timestamp, text, integer, json,serial  } from "drizzle-orm/pg-core";

export const webscrape = pgTable("webscrape", {
  id: serial("id").primaryKey().notNull(),
  url: text("url").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const pages = pgTable("pages", {
  id: serial("id").primaryKey().notNull(),
  webscrape_id: integer("webscrape_id").references(() => webscrape.id).notNull(),
  page_url: text("page_url").notNull(),
  status: text("status").default("pending").notNull(), 
  last_attempted_at: timestamp("last_attempted_at", { withTimezone: true }),
})

export const scraped_data = pgTable("scraped_data", {
  id: serial("id").primaryKey().notNull(),
  page_id: integer("page_id").references(() => pages.id).notNull(),
  data: json("data").notNull(), 
  scraped_at: timestamp("scraped_at", { withTimezone: true }).defaultNow().notNull(),
});

export const errors = pgTable("errors", {
  id: serial("id").primaryKey().notNull(),
  page_id: integer("page_id").references(() => pages.id).notNull(),
  error_message: text("error_message").notNull(),
  occurred_at: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
});
