import { pgTable, timestamp, text, index, integer, serial  } from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: serial("id").primaryKey().notNull(),
  role: text("role").notNull(),
  company_name: text("company_name").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(),
  date_applied: timestamp("date_applied", { mode: 'date' }),
  link: text("link"),
  salary: text("salary"),
  rate: text('rate'),
  user_id: text("user_id").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});