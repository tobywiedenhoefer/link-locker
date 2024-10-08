import api from "../services/api.service";

import mockData, { generateRandomNumber } from "../constants/mockData";
import { ErrorCodes } from "../shared/errors";
import Link from "../types/link.type";
import LockerState from "../types/lockerState.type";
import ApiResponse from "../types/apiResponse.type";
import Locker from "../types/locker.type";

export async function getLockers(): Promise<ApiResponse<Locker[]>> {
  /** Uses bearer token to gather all lockers for the associated token's user.*/
  if (mockData.use) {
    return {
      success: true,
      payload: mockData.open.lockers,
    };
  }

  try {
    return await api.get("lockers/").json<ApiResponse<Locker[]>>();
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.CouldNotFindLockers,
      errorMessage: `Could not find lockers. Error raised: ${e}`,
    };
  }
}

export async function getLockedLocker(
  combination: string
): Promise<ApiResponse<number>> {
  let locker: Locker | undefined;
  if (mockData.use) {
    for (let _locker in mockData.locked.lockers) {
      const l = mockData.locked.lockers[_locker];
      if (!l.locked) {
        continue;
      }
      if (l.combination === combination) {
        locker = l;
        break;
      }
    }
    return !!locker
      ? {
          success: true,
          payload: locker.id,
        }
      : {
          success: false,
          errorCode: ErrorCodes.CouldNotUnlock,
          errorMessage: "Could not unlock.",
        };
  }

  try {
    return await api
      .post("lockers/locked/id", {
        json: { combination: combination },
      })
      .json<ApiResponse<Locker["id"]>>();
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.CouldNotFindLockers,
      errorMessage: `Could not find locker. Error raised: ${e}`,
    };
  }
}

export async function getLinks(
  lockerId?: number,
  getLockedLinks?: boolean
): Promise<ApiResponse<Link[]>> {
  /** Uses locker id to gather all all links for specified locked locker id. */
  if (mockData.use) {
    if (
      lockerId !== undefined &&
      mockData.open.links.hasOwnProperty(lockerId)
    ) {
      return {
        success: true,
        payload: mockData.open.links[lockerId],
      };
    } else {
      return {
        success: false,
        errorCode: ErrorCodes.InvalidLockerId,
        errorMessage: "Locker Id does not exist for user.",
      };
    }
  }

  try {
    const userOwnsLockerResponse = await api
      .post("lockers/userOwnsLocker", {
        json: { lockerId: lockerId, locked: !!getLockedLinks },
      })
      .json<ApiResponse<boolean>>();
    if (!userOwnsLockerResponse.success) {
      return userOwnsLockerResponse;
    }
    return await api.get(`links/${lockerId}`).json<ApiResponse<Link[]>>();
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.UnexpectedErrorRaisedDuringDBCall,
      errorMessage: `An unexpected error was raised while making a DB call: ${e}`,
    };
  }
}

export async function getLockedLinks(
  lockerId: number | undefined,
  state: LockerState
): Promise<ApiResponse<Link[]>> {
  /** Gets all links for a locker with the same unique combination */
  if (mockData.use) {
    for (const ind in mockData.locked.lockers) {
      const locker = mockData.locked.lockers[ind];
      if (
        locker.locked &&
        locker.id === lockerId &&
        locker.combination === state.combination
      ) {
        return {
          success: true,
          payload: mockData.locked.links[locker.id],
        };
      }
    }
  }

  try {
    const matchingLockerResp = await api
      .post("lockers/locked/id", { json: { combination: state.combination } })
      .json<ApiResponse<Locker[]>>();
    if (!matchingLockerResp.success) {
      return matchingLockerResp;
    }
    return await getLinks(lockerId, true);
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.CouldNotUnlock,
      errorMessage: `Could not find/unlock locker. Error raised: ${e}`,
    };
  }
}

export async function addNewLink(
  lockerId: number,
  link: Link
): Promise<ApiResponse<Link["id"]>> {
  if (mockData.use) {
    return { success: true, payload: generateRandomNumber() };
  }

  try {
    return await api
      .post("links/add", {
        json: {
          name: link.name,
          url: link.url,
          tags: link.tags,
          lockerId: lockerId,
        },
      })
      .json<ApiResponse<Link["id"]>>();
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.CouldNotAddNewLink,
      errorMessage: `Link could not be added. Error was raised: ${e}`,
    };
  }
}

export async function addNewLocker(
  locker: Locker
): Promise<ApiResponse<number>> {
  if (mockData.use) {
    const newLocker: Locker = {
      ...locker,
      id: generateRandomNumber(),
    };
    const lockerType: keyof typeof mockData = locker.locked ? "locked" : "open";
    mockData[lockerType].lockers.push(newLocker);
    mockData[lockerType].links[newLocker.id] = [];
    return { success: true, payload: newLocker.id };
  }

  try {
    return await api
      .post("lockers/new", {
        json: {
          name: locker.name,
          locked: String(locker.locked),
          combination: locker.locked ? locker.combination : "",
        },
      })
      .json<ApiResponse<Locker["id"]>>();
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.CouldNotAddNewLocker,
      errorMessage: `API ressponse is either undefined or unsuccessful, could not add a new locker. Error raised: ${e}`,
    };
  }
}

export async function authenticateLogin(
  username: string,
  password: string
): Promise<ApiResponse<string>> {
  if (mockData.use) {
    return {
      success: true,
      payload: mockData.token,
    };
  }

  if (!username || !password) {
    return {
      success: false,
      errorCode: ErrorCodes.IncorrectRequestFormat,
      errorMessage: "Incorrect request format.",
    };
  }

  try {
    return await api
      .post("user/login", { json: { username: username, password: password } })
      .json<ApiResponse<string>>();
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.CouldNotLoginUser,
      errorMessage: `Could not authenticate user. Error raised ${e}`,
    };
  }
}

export async function createAndAuthenticateLogin(
  username: string,
  password: string
): Promise<ApiResponse<string>> {
  if (mockData.use) {
    return {
      success: true,
      payload: mockData.token,
    };
  }

  if (!username || !password) {
    return {
      success: false,
      errorCode: ErrorCodes.IncorrectRequestFormat,
      errorMessage: "Incorrect request format.",
    };
  }

  try {
    const createdUser = await api
      .post("create-user", { json: { username: username, password: password } })
      .json<ApiResponse<any>>();
    if (!createdUser.success) {
      return createdUser;
    }
    return await authenticateLogin(username, password);
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.CouldNotCreateUser,
      errorMessage: `Could not create user. Error raised: ${e}`,
    };
  }
}

export async function isUsernameAvailable(
  username: string
): Promise<ApiResponse<boolean>> {
  if (mockData.use) {
    return {
      success: true,
      payload: true,
    };
  }
  try {
    const usernameAvailable = await api
      .post("username-available", { json: { username: username } })
      .json<ApiResponse<boolean>>();
    return usernameAvailable;
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.UnexpectedErrorRaisedDuringDBCall,
      errorMessage: `Error raised: ${e}`,
    };
  }
}

export async function removeLink(
  linkId: number
): Promise<ApiResponse<undefined>> {
  if (mockData.use) {
    return {
      success: true,
      payload: undefined,
    };
  }
  try {
    const linkRemoved = await api
      .post("links/unlink", { json: { linkId: linkId } })
      .json<ApiResponse<undefined>>();
    return linkRemoved;
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.CouldNotUnlink,
      errorMessage: `Could not unlink: ${e}`,
    };
  }
}
