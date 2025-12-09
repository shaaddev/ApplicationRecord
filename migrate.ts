import { config } from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "./db";

config({
  path: ".env.local",
});

async function pushMigrations() {
  if (!process.env.NEON_DB) {
    throw new Error("URL is not defined");
  }

  await migrate(db, {
    migrationsFolder: "./drizzle",
  });

  console.log("Migrations Complete");
  await client.end();
  process.exit(0);
}

pushMigrations().catch((err) => {
  console.error("Migration failed");
  console.error(err);
  process.exit(1);
});
