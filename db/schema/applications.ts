import { pgTable, timestamp, text, index, integer, serial  } from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: serial("id").primaryKey().notNull(),
  role: text("role").notNull(),
  company_name: text("company_name").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(),
  date_applied: text("date_applied"),
  link: text("link"),
  salary: text("salary"),
  user_id: text("user_id"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});