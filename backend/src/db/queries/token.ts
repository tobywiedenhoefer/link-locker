import { and, between, count, eq, sql } from "drizzle-orm";

import { db } from "../db";
import { InsertToken, tokensTable } from "../schema";

export async function getUnexpiredTokensCount(tokenId: number) {
  return await db
    .select({ count: count() })
    .from(tokensTable)
    .where(
      and(
        eq(tokensTable.id, tokenId),
        between(
          tokensTable.created_at,
          sql`now() - interval '30 minutes'`,
          sql`now()`
        )
      )
    );
}

export async function getUnexpiredTokens(tokenId: string) {
  return await db
    .select()
    .from(tokensTable)
    .where(
      and(
        eq(tokensTable.token, tokenId),
        between(
          tokensTable.created_at,
          sql`now() - interval '30 minutes'`,
          sql`now()`
        )
      )
    );
}

export async function createNewTokenByUserId(userId: InsertToken["user_id"]) {
  return await db
    .insert(tokensTable)
    .values({
      user_id: userId,
    })
    .returning({ token: tokensTable.token });
}
