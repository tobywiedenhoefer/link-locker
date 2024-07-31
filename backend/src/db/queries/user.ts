import { eq } from "drizzle-orm";

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
