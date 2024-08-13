import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { InsertLink, SelectLink, linksTable } from "../schema";

export async function getLinksByLockerId(
  lockerId: SelectLink["locker_id"]
): Promise<SelectLink[]> {
  return await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.locker_id, lockerId || -1))
    .limit(50);
}

export async function addLink(locker: {
  name: InsertLink["name"];
  url: InsertLink["url"];
  locker_id: InsertLink["locker_id"];
}) {
  return await db
    .insert(linksTable)
    .values(locker)
    .returning({ newLinkId: linksTable.id });
}
