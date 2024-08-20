import { and, eq, sql } from "drizzle-orm";

import { db } from "../db";
import { InsertLink, SelectLink, linksTable, tagsTable } from "../schema";

export async function getLinksByLockerId(lockerId: SelectLink["locker_id"]) {
  return await db
    .select({
      id: linksTable.id,
      name: linksTable.name,
      url: linksTable.url,
      tags: sql<
        string[]
      >`coalesce(array_agg(${tagsTable.name}) filter (where ${tagsTable.name} is not null), '{}')`,
    })
    .from(linksTable)
    .where(eq(linksTable.locker_id, lockerId || -1))
    .groupBy(linksTable.id)
    .leftJoin(tagsTable, eq(linksTable.id, tagsTable.link_id))
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
