import { Router } from "express";
import * as bcrypt from "bcryptjs";

import { ErrorCodes } from "../constants/errors";
import Error from "../types/error.type";
import { createUser } from "../src/db/queries/createUser";
import ApiResponse from "../types/ApiResponse.type";

const router = Router();

// post

router.post("/", async (req, res) => {
  /**
   * Using a username-password combo, create the user in the database.
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
  let resp: ApiResponse<undefined>;
  if (!submittedFields.username || !submittedFields.password) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }
  await bcrypt.hash(submittedFields.password, 15, async (error, result) => {
    if (error) {
      resp = {
        success: false,
        errorCode: ErrorCodes.UnexpectedErrorRaisedWhileHashingPassword,
        errorMessage: "Unexpected error was raised while creating user.",
      };
      res.json(resp);
      return;
    }
    const success = await createUser(submittedFields.username, result);
    resp = success
      ? {
          success: success,
          payload: undefined,
        }
      : {
          success: success,
          errorCode: ErrorCodes.UnexpectedErrorRaisedWhileCreatingUser,
          errorMessage: "Unexpected error was raised while creating user.",
        };
    res.json(resp);
  });
});

export { router as createUserRoutes };
