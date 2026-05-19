/**
 * Add a new user to LLM-Ops, mirroring `UsersService.createUser`.
 *
 * Why this exists: AuthGuard rejects any request whose `email` header
 * doesn't match an existing User row. The console's `signupUser` mutation
 * is itself behind AuthGuard, so brand-new users can't bootstrap themselves.
 * This script creates the User + Organization + OrganizationMember + ApiKey
 * chain directly via Prisma, identical to what `signupUser` does.
 *
 * Usage:
 *   DATABASE_URL=<prod-or-dev-pg-url> \
 *     npx tsx scripts/add-user.ts --email "newuser@smartnews.com" --name "New User"
 *
 * Idempotent: if the user already exists, prints their id and exits without
 * creating a duplicate organization or API key.
 *
 * Source of truth: keep this in sync with
 * apps/server/src/app/identity/users.service.ts -> createUser()
 */

import { PrismaClient } from "@prisma/client";
import { randomUUID, randomBytes } from "crypto";

const prisma = new PrismaClient();

interface Args {
  email: string;
  name: string;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const out: Partial<Args> = {};
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === "--email" || flag === "--name") {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${flag}`);
      }
      out[flag.slice(2) as keyof Args] = value;
      i++;
    }
  }
  if (!out.email || !out.name) {
    throw new Error(
      "Usage: npx tsx scripts/add-user.ts --email <email> --name <name>"
    );
  }
  return out as Args;
}

async function addUser({ email, name }: Args) {
  const lowerEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: lowerEmail },
  });
  if (existing) {
    console.log(
      JSON.stringify(
        {
          status: "already_exists",
          user: { id: existing.id, email: existing.email },
        },
        null,
        2
      )
    );
    return;
  }

  const userId = randomUUID();

  // Mirrors UsersService.createUser exactly:
  // 1. Create User
  // 2. Create Organization with this user as the first OrganizationMember
  // 3. Create ApiKey for that organization
  const user = await prisma.user.create({
    data: { id: userId, email: lowerEmail },
  });

  const org = await prisma.organization.create({
    data: {
      name: `${name}'s Organization`,
      waitlisted: false,
      members: {
        create: { userId },
      },
    },
  });

  const apiKeyValue = `llm_ops_${randomBytes(16).toString("hex")}`;
  const apiKey = await prisma.apiKey.create({
    data: { id: apiKeyValue, organizationId: org.id },
  });

  console.log(
    JSON.stringify(
      {
        status: "created",
        user: { id: user.id, email: user.email },
        organization: { id: org.id, name: org.name },
        apiKey: apiKey.id,
      },
      null,
      2
    )
  );
}

(async () => {
  try {
    const args = parseArgs();
    await addUser(args);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
