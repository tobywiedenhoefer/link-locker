import { Router } from "express";
import * as bcrypt from "bcryptjs";

import { ErrorCodes } from "../constants/errors";
import Error from "../types/error.type";
import ApiResponse from "../types/ApiResponse.type";
import { getUserByUsername } from "../src/db/queries/user";

const router = Router();

// post
router.post("/", async (req, res) => {
  /**
   * Using a username-password combo, get the user id needed for further queries.
   * Request body: {
   *   username: string,
   *   password: string
   * }
   * Response: {
   *   success: true,
   *   payload: string,
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string,
   * }
   */
  const submittedFields = req.body;
  let resp: ApiResponse<number>;
  if (!submittedFields.username || !submittedFields.password) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }
  const qRes = await getUserByUsername(submittedFields.username);
  if (qRes.length === 0) {
    resp = {
      success: false,
      errorCode: ErrorCodes.CouldNotFindUsernameInDatabase,
      errorMessage: `Could not find username ${submittedFields.username}.`,
    };
    res.json(resp);
    return;
  }
  bcrypt.compare(
    submittedFields.password,
    qRes[0].password_hash,
    (_error, result) => {
      resp = result
        ? {
            success: true,
            payload: qRes[0].id,
          }
        : {
            success: false,
            errorCode: ErrorCodes.PasswordDoesNotMatchHash,
            errorMessage: "Authentication Failure.",
          };
      res.json(resp);
    }
  );
});

export { router as userRoutes };
