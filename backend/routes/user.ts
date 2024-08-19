import { Router } from "express";
import * as bcrypt from "bcryptjs";

import { ErrorCodes } from "../constants/errors";
import Error from "../types/error.type";
import ApiResponse from "../types/ApiResponse.type";
import {
  getUserByUsername,
  getUserIdByUsernameAndPasswordHash,
} from "../src/db/queries/user";
import { createNewTokenByUserId } from "../src/db/queries/token";

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

router.post("/login", async (req, res) => {
  /**
   * Using a username-password combo, login by creating and returning a new token.
   * Request: {
   *   username: string,
   *   password: string
   * }
   * Response: {
   *   success: true,
   *   payload: number
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string
   * }
   */
  let resp: ApiResponse<string>;
  if (
    !req.body.username ||
    !req.body.password ||
    typeof req.body.username !== "string" ||
    typeof req.body.password !== "string"
  ) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }

  const userByUsername = await getUserByUsername(req.body.username);
  if (userByUsername.length === 0) {
    resp = {
      success: false,
      errorCode: ErrorCodes.CouldNotFindUsernameInDatabase,
      errorMessage: `Could not find username in database: ${req.body.username}`,
    };
    res.json(resp);
    return;
  }
  bcrypt.compare(
    req.body.password,
    userByUsername[0].password_hash,
    async (error, success) => {
      if (error) {
        resp = {
          success: false,
          errorCode: ErrorCodes.UnexpectedErrorRaisedWhileHashingPassword,
          errorMessage:
            "An unexpected error was raised while comparing password hashes.",
        };
        res.json(resp);
        return;
      } else if (!success) {
        resp = {
          success: false,
          errorCode: ErrorCodes.PasswordDoesNotMatchHash,
          errorMessage: "Password hashes do not match.",
        };
        res.json(resp);
        return;
      }

      const createTokenApiResponse = await createNewTokenByUserId(
        userByUsername[0].id
      );
      const [{ token }] = createTokenApiResponse;
      resp = {
        success: true,
        payload: token,
      };
      res.json(resp);
      return;
    }
  );
});

export { router as userRoutes };
