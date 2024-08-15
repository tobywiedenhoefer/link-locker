import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { InsertTag, SelectTag, tagsTable } from "../schema";

export async function getTagsByLinkId(
  linkId: SelectTag["link_id"]
): Promise<SelectTag[]> {
  return await db
    .select()
    .from(tagsTable)
    .where(eq(tagsTable.link_id, linkId || -1))
    .limit(10);
}

export async function addTagsByLinkId(
  linkId: InsertTag["link_id"],
  tags: string[]
) {
  if (Number.isNaN(linkId) || typeof linkId === "number") {
    throw Error("linkId must be a number.");
  }
  return await db.insert(tagsTable).values(
    tags.map((tag) => {
      return {
        name: tag,
        link_id: linkId,
      };
    })
  );
}
