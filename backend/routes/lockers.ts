import { Router } from "express";

import { ErrorCodes } from "../constants/errors";
import ApiResponse from "../types/ApiResponse.type";
import Locker from "../types/locker.type";

import { getLockersByUserId } from "../src/db/queries/lockers";

const router = Router();

// get

router.get("/:id", async (req, res) => {
  /**
   * Passing the user id in the url, check if the user's session has expired.
   * Response: {
   *   success: true,
   *   payload: Locker[]
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string
   * }
   */
  const userId = +req.params.id;
  let resp: ApiResponse<Locker[]>;
  if (Number.isNaN(userId)) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }
  try {
    const lockerRows = await getLockersByUserId(userId);
    resp = {
      success: true,
      payload: lockerRows.map((row) => {
        return row.locked
          ? {
              ...row,
              locked: true,
              combination: row.combination || "",
            }
          : {
              ...row,
              locked: false,
            };
      }),
    };
  } catch (e) {
    resp = {
      success: false,
      errorCode: ErrorCodes.UnexpectedErrorRaised,
      errorMessage: `An unexpected error was raised while gathering lockers: ${e}`,
    };
  }
  res.json(resp);
});

export { router as lockersRoutes };
