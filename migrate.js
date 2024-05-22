const { drizzle } = require('drizzle-orm/postgres-js/driver');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres')
require('dotenv').config({ path: '.env.local'});

const pushMigrations = async () => {
  const migrationClient = postgres(process.env.DATABASE_URL, {
    max: 1,
  });

  const migrationDb = drizzle(migrationClient);

  await migrate(migrationDb, { migrationsFolder: './drizzle'});

  await migrationClient.end();
}

pushMigrations()