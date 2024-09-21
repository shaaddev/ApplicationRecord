import { migrate } from 'drizzle-orm/postgres-js/migrator'
import dotenv from 'dotenv'
import { client, db } from './db'

dotenv.config({ path: '.env.local' });

async function pushMigrations() {
  await migrate(db, { 
    migrationsFolder: './drizzle'
  });
  console.log('Migrations complete')
  await client.end();
}

pushMigrations()