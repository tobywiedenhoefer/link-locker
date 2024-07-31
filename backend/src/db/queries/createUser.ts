import { db } from "../db";
import { InsertUser, usersTable } from "../schema";

export async function createUser(
  username: string,
  password_hash: string
): Promise<boolean> {
  const data: InsertUser = {
    username: username,
    password_hash: password_hash,
  };
  try {
    await db.insert(usersTable).values(data);
  } catch (e) {
    console.error("Error raised while trying to insert user: ", e);
    return false;
  }
  return true;
}
