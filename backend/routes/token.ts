import { Router } from "express";

import { ErrorCodes } from "../constants/errors";
import ApiResponse from "../types/ApiResponse.type";

import { getUnexpiredTokensCount } from "../src/db/queries/token";

const router = Router();

// get

router.get("/:id", async (req, res) => {
  /**
   * Passing the token id in the url, check if the user's session has expired.
   * Response: {
   *   success: true,
   *   payload: undefined,
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string,
   * }
   */
  const reqTokenId = +req.params.id;
  let resp: ApiResponse<undefined>;
  if (Number.isNaN(reqTokenId)) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }
  try {
    const [dbRes] = await getUnexpiredTokensCount(reqTokenId);
    resp =
      dbRes.count === 0
        ? {
            success: false,
            errorCode: ErrorCodes.CacheExpiredOrNotSet,
            errorMessage: "Auth token expired or not set.",
          }
        : {
            success: true,
            payload: undefined,
          };
    res.json(resp);
    return;
  } catch (e) {
    resp = {
      success: false,
      errorCode: ErrorCodes.UnexpectedErrorRaised,
      errorMessage: `An unexpected error was raised while running auth token count query: ${e}`,
    };
    res.json(resp);
    return;
  }
});
