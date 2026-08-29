/**
 * One-off import of the Kinde user export into the better-auth tables.
 *
 * Keeps the Kinde user id (kp_...) as the better-auth user id so existing
 * `applications.user_id` rows keep pointing at the right owner. Google and
 * GitHub identities become `account` rows so a future social provider can
 * link to the same user instead of creating a duplicate.
 *
 * Usage (picks NEON_DB when NODE_ENV=production, LOCAL_DATABASE_URL otherwise):
 *   NODE_ENV=production pnpm dlx tsx db/scripts/migrate-kinde-users.ts --dry-run
 *   NODE_ENV=production pnpm dlx tsx db/scripts/migrate-kinde-users.ts
 *
 * Safe to re-run: inserts use ON CONFLICT DO NOTHING.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { count } from "drizzle-orm";
import { client, db, databaseUrl } from "../index";
import { account, user } from "../schema";

type KindeIdentity = {
  type: string;
  identity: string;
  provider?: string;
  is_verified?: boolean;
  profile?: {
    name?: string;
    picture?: string;
    avatar_url?: string;
  };
};

type KindeUser = {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  created_on: string;
  email_verified: boolean;
  identities: KindeIdentity[];
};

// Must match what better-auth writes for these providers (see
// @better-auth/core social-providers and createOAuthAccountIssuer).
const ISSUERS: Record<string, string> = {
  google: "https://accounts.google.com",
  github: "local:oauth:github",
};

const dryRun = process.argv.includes("--dry-run");
const file =
  process.argv.find((a) => a.startsWith("--file="))?.slice("--file=".length) ??
  "kinde_export/users.ndjson";

function displayName(u: KindeUser) {
  const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  if (full) return full;
  const social = u.identities.find((i) => i.profile?.name)?.profile?.name;
  if (social) return social;
  return u.email!.split("@")[0];
}

function image(u: KindeUser) {
  for (const i of u.identities) {
    const src = i.profile?.picture ?? i.profile?.avatar_url;
    if (src) return src;
  }
  return null;
}

async function main() {
  if (!databaseUrl) throw new Error("database url is not set");
  console.log(
    `${dryRun ? "[dry run] " : ""}target: ${new URL(databaseUrl).hostname}`,
  );

  const kindeUsers: KindeUser[] = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const skipped: string[] = [];
  const merged: string[] = [];
  const userRows: (typeof user.$inferInsert)[] = [];
  const accountRows: (typeof account.$inferInsert)[] = [];
  // Kinde allowed the same mailbox to exist twice (one per social login).
  // better-auth keys users by email, so those collapse into one user that
  // keeps the first id and gets every social identity attached.
  const byEmail = new Map<string, KindeUser>();

  for (const u of kindeUsers) {
    const email = u.email?.trim().toLowerCase();
    if (!email) {
      skipped.push(`${u.id}: no email`);
      continue;
    }
    const existing = byEmail.get(email);
    if (!existing) {
      byEmail.set(email, { ...u, email });
      continue;
    }
    merged.push(`${u.id} -> ${existing.id} (${email})`);
    existing.identities.push(...u.identities);
    existing.email_verified = existing.email_verified || u.email_verified;
    existing.first_name ||= u.first_name;
    existing.last_name ||= u.last_name;
  }

  for (const u of byEmail.values()) {
    const createdAt = new Date(u.created_on);
    userRows.push({
      id: u.id,
      name: displayName(u),
      email: u.email!,
      emailVerified: u.email_verified,
      image: image(u),
      createdAt,
      updatedAt: createdAt,
    });

    for (const identity of u.identities) {
      if (!identity.provider) continue;
      const issuer = ISSUERS[identity.provider];
      if (!issuer) {
        skipped.push(`${u.id}: unknown provider ${identity.provider}`);
        continue;
      }
      accountRows.push({
        id: randomUUID(),
        issuer,
        providerId: identity.provider,
        accountId: String(identity.identity),
        userId: u.id,
        createdAt,
        updatedAt: createdAt,
      });
    }
  }

  console.log(
    `parsed ${kindeUsers.length} kinde users -> ${userRows.length} users, ${accountRows.length} accounts`,
  );
  for (const m of merged) console.log(`  merged ${m}`);
  for (const s of skipped) console.log(`  skipped ${s}`);

  if (dryRun) {
    console.log("dry run, nothing written");
    await client.end();
    return;
  }

  const result = await db.transaction(async (tx) => {
    const insertedUsers = await tx
      .insert(user)
      .values(userRows)
      .onConflictDoNothing()
      .returning({ id: user.id });
    const insertedAccounts = await tx
      .insert(account)
      .values(accountRows)
      .onConflictDoNothing()
      .returning({ id: account.id });
    return {
      users: insertedUsers.length,
      accounts: insertedAccounts.length,
    };
  });

  const [{ value: totalUsers }] = await db
    .select({ value: count() })
    .from(user);
  const [{ value: totalAccounts }] = await db
    .select({ value: count() })
    .from(account);

  console.log(
    `inserted ${result.users} users and ${result.accounts} accounts (table totals: ${totalUsers} users, ${totalAccounts} accounts)`,
  );
  await client.end();
}

main().catch(async (err) => {
  console.error(err);
  await client.end().catch(() => {});
  process.exit(1);
});
