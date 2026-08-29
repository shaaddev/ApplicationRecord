import { config } from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db, databaseUrl } from ".";

config({
  path: ".env.local",
});

async function pushMigrations() {
  if (!databaseUrl) {
    throw new Error("URL is not defined");
  }

  await migrate(db, {
    migrationsFolder: "./db/migrations",
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
