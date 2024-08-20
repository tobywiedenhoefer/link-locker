import { Router } from "express";

import { ErrorCodes } from "../constants/errors";
import ApiResponse from "../types/ApiResponse.type";
import Locker from "../types/locker.type";

import {
  createLocker,
  getLockedLockerByUserIdAndCombination,
  getLockerCountByUserIdAndLockerId,
  getLockersByUserId,
} from "../src/db/queries/lockers";

const router = Router();

// get

router.get("/", async (req, res) => {
  /**
   * Using the userId set in the request body during bearer token validation, check if the user's session has expired.
   * Response: {
   *   success: true,
   *   payload: Locker[]
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string
   * }
   */
  const userId = req.body.userId;
  let resp: ApiResponse<Locker[]>;
  if (!userId || typeof userId !== "number" || Number.isNaN(userId)) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: `Incorrect request format for userId: ${userId}`,
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

// post
router.post("/locked/id", async (req, res) => {
  /**
   * Pass the user id and combination into the request body, returns a matching locked locker.
   * Request body: {
   *   userId: number,
   *   combination: string
   * }
   * Response: {
   *   success: true,
   *   payload: Locker[]
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string
   * }
   */
  let resp: ApiResponse<Locker["id"]>;
  let reqUserId: number;
  let reqCombination: string;
  try {
    reqUserId = +req.body.userId;
    reqCombination = req.body.combination;
  } catch (_) {
    reqUserId = NaN;
    reqCombination = "";
  }
  if (Number.isNaN(reqUserId) || reqCombination.length === 0) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }

  try {
    const lockerRows = await getLockedLockerByUserIdAndCombination(
      reqUserId,
      reqCombination
    );
    if (lockerRows.length === 0) {
      throw Error(
        `Query failed for userId ${reqUserId} and combination ${reqCombination}`
      );
    } else if (!lockerRows[0].combination) {
      throw Error("Matched locker has an invalid combination string.");
    }
    resp = {
      success: true,
      payload: lockerRows[0].id,
    };
  } catch (e) {
    resp = {
      success: false,
      errorCode: ErrorCodes.ProblemFindingLockerInDatabase,
      errorMessage: `Problem finding locked locker in databse: ${e}`,
    };
  }
  res.json(resp);
  return;
});

router.post("/userOwnsLocker", async (req, res) => {
  /**
   * Pass the user id and combination into the request body, returns a boolean if userId owns the locker.
   * Request body: {
   *   userId: number,
   *   lockerId: number
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
  let reqUserId: number;
  let reqLockerId: number;
  try {
    reqUserId = +req.body.userId;
    reqLockerId = +req.body.lockerId;
  } catch (_) {
    reqUserId = NaN;
    reqLockerId = NaN;
  }
  if (Number.isNaN(reqUserId) || Number.isNaN(reqLockerId)) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }

  try {
    const [{ count }] = await getLockerCountByUserIdAndLockerId(
      reqUserId,
      reqLockerId
    );
    if (!count) {
      throw Error(
        `Could not find lockerId ${reqLockerId} associated with userId ${reqUserId}`
      );
    }
    resp = {
      success: true,
      payload: true,
    };
  } catch (e) {
    resp = {
      success: false,
      errorCode: ErrorCodes.ProblemFindingLockerInDatabase,
      errorMessage: `Problem finding locked locker in databse: ${e}`,
    };
  }
  res.json(resp);
  return;
});

router.post("/new", async (req, res) => {
  /**
   * Creates a new locker and returns the new id.
   * Request body: {
   *   userId: number,
   *   name: string,
   *   locked: boolean,
   *   combination: string
   * }
   * Response: {
   *   success: true,
   *   payload: { newLockerId: number }[]
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string
   * }
   */
  let resp: ApiResponse<Locker["id"]>;
  let reqUserId: number;
  let reqName: string;
  let reqLocked: boolean | undefined;
  let reqCombination: string | undefined;
  try {
    reqUserId = +req.body.userId;
    reqName = req.body.name;
    reqLocked = req.body.locked === "true";
    reqCombination = req.body.combination;
  } catch (_) {
    reqUserId = NaN;
    reqName = "";
    reqLocked = false;
    reqCombination = "";
  }
  if (
    typeof reqUserId !== "number" ||
    Number.isNaN(reqUserId) ||
    typeof reqName !== "string" ||
    typeof reqLocked !== "boolean" ||
    typeof reqCombination !== "string"
  ) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage:
        "Incorrect request format. Request body attributes of invalid types.",
    };
    res.json(resp);
    return;
  } else if (
    reqUserId <= 0 ||
    reqName.length === 0 ||
    (reqLocked && reqCombination.length === 0)
  ) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Request body attributes do not meet specifications.",
    };
    res.json(resp);
    return;
  }

  try {
    const insertLockerResponse = await createLocker({
      user_id: reqUserId,
      name: reqName,
      locked: reqLocked,
      combination: reqCombination,
    });
    if (insertLockerResponse.length === 0) {
      throw Error("Failed to add locker to DB");
    }
    resp = {
      success: true,
      payload: insertLockerResponse[0].newLockerId,
    };
  } catch (e) {
    resp = {
      success: false,
      errorCode: ErrorCodes.CouldNotAddNewLocker,
      errorMessage: `Problem adding a new locker: ${e}`,
    };
  }
  res.json(resp);
  return;
});

export { router as lockersRoutes };
