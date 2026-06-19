import { createHmac, randomBytes } from "crypto";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}:${hash}`;
}

const [,, email, password, firstName, lastName] = process.argv;

if (!email || !password || !firstName || !lastName) {
  console.error("Usage: pnpm --filter @workspace/scripts run seed-admin <email> <password> <firstName> <lastName>");
  process.exit(1);
}

const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
if (existing.length > 0) {
  console.error(`User with email ${email} already exists.`);
  process.exit(1);
}

const [user] = await db.insert(usersTable).values({
  email,
  password: hashPassword(password),
  firstName,
  lastName,
  role: "admin",
  status: "active",
}).returning();

console.log(`✅ Admin user created successfully!`);
console.log(`   ID:    ${user.id}`);
console.log(`   Email: ${user.email}`);
console.log(`   Name:  ${user.firstName} ${user.lastName}`);
console.log(`   Role:  ${user.role}`);

await db.$client.end();
