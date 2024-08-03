import { eq } from "drizzle-orm";

import { db } from "../db";
import { SelectLocker, lockersTable } from "../schema";

export async function getLockersByUserId(
  userId: SelectLocker["user_id"]
): Promise<SelectLocker[]> {
  return await db
    .select()
    .from(lockersTable)
    .where(eq(lockersTable.id, userId))
    .limit(10);
}
