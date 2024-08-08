import { and, count, eq } from "drizzle-orm";

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

export async function getOpenLockersByUserId(
  userId: SelectLocker["user_id"]
): Promise<SelectLocker[]> {
  return await db
    .select()
    .from(lockersTable)
    .where(and(eq(lockersTable.id, userId), eq(lockersTable.locked, false)))
    .limit(10);
}

export async function getLockedLockerByUserIdAndCombination(
  userId: SelectLocker["user_id"],
  combination: SelectLocker["combination"]
): Promise<SelectLocker[]> {
  return await db
    .select()
    .from(lockersTable)
    .where(
      and(
        eq(lockersTable.user_id, userId),
        eq(lockersTable.locked, true),
        eq(lockersTable.combination, combination || "")
      )
    )
    .limit(1);
}

export async function getLockerCountByUserIdAndLockerId(
  userId: SelectLocker["user_id"],
  lockerId: SelectLocker["id"]
): Promise<{ count: number }[]> {
  return await db
    .select({ count: count() })
    .from(lockersTable)
    .where(and(eq(lockersTable.id, userId), eq(lockersTable.id, lockerId)));
}
