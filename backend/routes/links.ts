import { Router } from "express";

import ApiResponse from "../types/ApiResponse.type";
import Link from "../types/link.type";
import { ErrorCodes } from "../constants/errors";
import { addLink, getLinksByLockerId, unlink } from "../src/db/queries/links";
import { addTagsByLinkId } from "../src/db/queries/tags";

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
    const links: Link[] = linkRows.map((row) => {
      return {
        id: row.id,
        name: row.name,
        url: row.url,
        tags: row.tags,
      };
    });
    resp = {
      success: true,
      payload: links,
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
   * Passing the new link object in the url, a new link is added and the new id is returned.
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

  let name: string;
  let url: string;
  let tags: Array<string>;
  let lockerId: number;
  let userId: number;
  try {
    name = req.body.name;
    url = req.body.url;
    tags = req.body.tags;
    lockerId = req.body.lockerId;
    userId = req.body.userId;
    if (
      typeof name !== "string" ||
      typeof url !== "string" ||
      !(tags instanceof Array) ||
      typeof lockerId !== "number" ||
      Number.isNaN(lockerId)
    ) {
      throw Error(
        "Variables in req body were not able to be converted to correct types or instances."
      );
    }
  } catch (e) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: `Incorrect request format. Error occurred while parsing request: ${e}`,
    };
    res.json(resp);
    return;
  }

  try {
    const addLinkResp = await addLink({
      url: url,
      name: name,
      locker_id: lockerId,
      user_id: userId,
    });
    if (addLinkResp.length === 0) {
      resp = {
        success: false,
        errorCode: ErrorCodes.CouldNotAddNewLink,
        errorMessage: "New link could not be added.",
      };
    } else {
      await addTagsByLinkId(addLinkResp[0].newLinkId, tags);
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

router.post("/unlink", async (req, res) => {
  /**
   * Passing the linkId, remove a link.
   * Request body: {
   *   linkId: number,
   *   userId: number
   * }
   * Response: {
   *   success: true,
   *   payload: undefined
   * } | {
   *   success: false,
   *   errorCode: number,
   *   errorMessage: string
   * }
   */
  let resp: ApiResponse<undefined>;
  if (
    typeof req.body.linkId !== "number" ||
    typeof req.body.userId !== "number"
  ) {
    resp = {
      success: false,
      errorCode: ErrorCodes.IncorrectRequest,
      errorMessage: "Incorrect request format.",
    };
    res.json(resp);
    return;
  }
  const linkId: number = req.body.linkId;
  const userId: number = req.body.userId;
  try {
    const deletedIds = await unlink(linkId, userId);
    console.info(
      `Deleted link id ${linkId} for user id ${userId}: ${
        deletedIds.length > 0
      }`
    );
    resp = {
      success: true,
      payload: undefined,
    };
  } catch (e) {
    const em = `Could not delete link: ${linkId} for user id ${userId}: ${e}`;
    console.error(em);
    resp = {
      success: false,
      errorCode: ErrorCodes.LinkDoesNotExist,
      errorMessage: em,
    };
  }
  res.json(resp);
  return;
});

export { router as linksRoutes };
