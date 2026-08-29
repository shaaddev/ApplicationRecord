import type { Config } from "drizzle-kit";
import { databaseUrl } from "./db/index";

export default {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl!,
  },
  out: "./db/migrations",
} satisfies Config;
