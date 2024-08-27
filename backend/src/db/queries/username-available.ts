import { eq } from "drizzle-orm";

import { db } from "../db";
import { SelectUser, usersTable } from "../schema";

export async function usernameAvailable(
  username: SelectUser["username"]
): Promise<boolean> {
  const query = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);
  return query.length === 0;
}
