import { Router } from "express";

import { ErrorCodes } from "../constants/errors";
import ApiResponse from "../types/ApiResponse.type";
import { usernameAvailable } from "../src/db/queries/username-available";

const router = Router();

// post

router.post("/", async (req, res) => {
  /**
   * Check if the username is available.
   * Request body: {
   *   username: string
   * }
   * Response: {
   *   success: true,
   *   payload: boolean
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string
   * }
   */
  let resp: ApiResponse<boolean>;
  if (!req.body.username) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }
  try {
    const available = await usernameAvailable(req.body.username);
    resp = {
      success: true,
      payload: available,
    };
  } catch (e) {
    resp = {
      success: false,
      errorCode: ErrorCodes.UnexpectedErrorRaised,
      errorMessage: `An unexpected error raised while checking for database: ${e}`,
    };
  }
  res.json(resp);
  return;
});

export { router as usernameAvailableRoute };
