import { Router } from "express";

import ApiResponse from "../types/ApiResponse.type";
import Link from "../types/link.type";
import { ErrorCodes } from "../constants/errors";
import { addLink, getLinksByLockerId } from "../src/db/queries/links";

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
    const linkRows = await getLinksByLockerId(lockerId);
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

// post

router.post("/add", async (req, res) => {
  /**
   * Passing the new locker object in the url, a new link is added and the new id is returned.
   * Request body: {
   *   url: string,
   *   name: string,
   *   tags: string[],
   *   lockerId: number
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
  let resp: ApiResponse<number>;

  if (
    typeof req.body.name !== "number" ||
    typeof req.body.url !== "string" ||
    !(req.body.tags instanceof Array) ||
    typeof req.body.lockerId !== "number"
  ) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }

  try {
    const addLinkResp = await addLink({
      url: req.body.url,
      name: req.body.name,
      locker_id: req.body.lockerId,
    });
    if (addLinkResp.length === 0) {
      resp = {
        success: false,
        errorCode: ErrorCodes.CouldNotAddNewLink,
        errorMessage: "New link could not be added.",
      };
    } else {
      resp = {
        success: true,
        payload: addLinkResp[0].newLinkId,
      };
    }
  } catch (e) {
    resp = {
      success: false,
      errorCode: ErrorCodes.UnexpectedErrorRaised,
      errorMessage: `An unexpected error was raised while adding link into db: ${e}`,
    };
  }
  res.json(resp);
  return;
});

export { router as linksRoutes };
