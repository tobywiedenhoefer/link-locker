import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { SelectLink, linksTable } from "../schema";

export async function getLionksByLockerId(
  lockerId: SelectLink["locker_id"]
): Promise<SelectLink[]> {
  return await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.locker_id, lockerId || -1))
    .limit(50);
}
