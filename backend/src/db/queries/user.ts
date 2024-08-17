import { eq, and } from "drizzle-orm";

import { db } from "../db";
import { SelectUser, usersTable } from "../schema";

export async function getUserByUserId(
  userId: SelectUser["id"]
): Promise<SelectUser[]> {
  return await db.select().from(usersTable).where(eq(usersTable.id, userId));
}

export async function getUserByUsername(
  username: SelectUser["username"]
): Promise<SelectUser[]> {
  return await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
}

export async function getUserIdByUsernameAndPasswordHash(
  username: SelectUser["username"],
  password_hash: SelectUser["password_hash"]
) {
  return await db
    .select({ userId: usersTable.id })
    .from(usersTable)
    .where(
      and(
        eq(usersTable.username, username),
        eq(usersTable.password_hash, password_hash)
      )
    );
}
