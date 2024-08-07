import { Router } from "express";

import ApiResponse from "../types/ApiResponse.type";
import Link from "../types/link.type";
import { ErrorCodes } from "../constants/errors";
import { getLionksByLockerId } from "../src/db/queries/links";

const router = Router();

// get

router.get("/:id", async (req, res) => {
  /**
   * Passing the locker id in the url, return a list of links.
   * Response: {
   *   success: true,
   *   payload: Link[]
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string
   * }
   */
  const lockerId = +req.params.id;
  let resp: ApiResponse<Link[]>;
  if (Number.isNaN(lockerId)) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }
  try {
    const linkRows = await getLionksByLockerId(lockerId);
    resp = {
      success: true,
      payload: linkRows.map((row) => {
        return {
          id: row.id,
          url: row.url,
          name: row.name,
          tags: [],
        };
      }),
    };
  } catch (e) {
    resp = {
      success: false,
      errorCode: ErrorCodes.UnexpectedErrorRaised,
      errorMessage: `An unexpected error was raised while getting links: ${e}`,
    };
  }
  res.json(resp);
});

export { router as linksRoutes };
