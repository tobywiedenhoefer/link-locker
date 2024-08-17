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

  bcrypt.hash(req.body.password, 15, async (error, result) => {
    if (error) {
      resp = {
        success: false,
        errorCode: ErrorCodes.UnexpectedErrorRaisedWhileHashingPassword,
        errorMessage:
          "An unexpected error was raised while hashing the requested password.",
      };
      res.json(resp);
      return;
    }

    const userIdApiResponse = await getUserIdByUsernameAndPasswordHash(
      req.body.username,
      result
    );
    if (userIdApiResponse.length !== 0) {
      resp = {
        success: false,
        errorCode: ErrorCodes.DBQueryReturnedNonUniqueOrNoRows,
        errorMessage: `User id and password hash db query row count was not a length of one: ${userIdApiResponse.length}`,
      };
      res.json(resp);
      return;
    }
    const [{ userId }] = userIdApiResponse;

    const createTokenApiResponse = await createNewTokenByUserId(userId);
    if (createTokenApiResponse.length !== 1) {
      resp = {
        success: false,
        errorCode: ErrorCodes.DBQueryReturnedNonUniqueOrNoRows,
        errorMessage: `Create a new token request returned with either none or multiple rows: ${createTokenApiResponse.length}`,
      };
      res.json(resp);
      return;
    }

    const [{ token }] = createTokenApiResponse;
    resp = {
      success: true,
      payload: token,
    };
    res.json(resp);
  });
});

export { router as userRoutes };
