import mockData, { generateRandomNumber } from "../constants/mockData";
import {
  ErrorCodes,
  CombinationNotFoundError,
  NotImplementedError,
} from "../shared/errors";
import { isValidDate } from "./date.store";
import Link from "../types/link.type";
import LockerState from "../types/lockerState.type";
import ApiResponse from "../types/apiResponse.type";
import Locker from "../types/locker.type";
import AuthCreds from "../types/authCreds.type";
import axios from "axios";

const baseUrl = `${Bun.env.API_URL || ""}:${Bun.env.API_PORT || ""}/api`;

async function getUserIdFromToken(
  token: string | null
): Promise<ApiResponse<number>> {
  if (!token) {
    return {
      success: false,
      errorCode: ErrorCodes.IncorrectRequestFormat,
      errorMessage: `Incorrect request format, token (${token}) must be a valid string.`,
    };
  }
  const resp = await axios.get<ApiResponse<number>>(
    `${baseUrl}/token/userid/${token}`,
    {}
  );
  if (resp.status !== 200 || !resp.data.success) {
    return {
      success: false,
      errorCode: !resp.data?.success
        ? resp.data.errorCode
        : ErrorCodes.CacheExpiredOrNotSet,
      errorMessage: !resp.data?.success
        ? resp.data.errorMessage
        : `Cache expired/not set for ${token}`,
    };
  }
  return {
    success: true,
    payload: resp.data.payload,
  };
}

export async function getLockers(
  token: string | null
): Promise<ApiResponse<Locker[]>> {
  /** Uses bearer token to gather all lockers for the associated token's user.*/
  if (mockData.use) {
    return {
      success: true,
      payload: mockData.open.lockers,
    };
  }

  const foundUserId = await getUserIdFromToken(token);
  if (!foundUserId.success) {
    return foundUserId;
  }

  const resp = await axios.get<ApiResponse<Locker[]>>(
    `${baseUrl}/lockers/${foundUserId.payload}`,
    {}
  );

  if (resp.status !== 200 && !resp.data?.success) {
    return {
      success: false,
      errorCode: resp.data?.errorCode || ErrorCodes.CouldNotFindLockers,
      errorMessage: resp.data?.errorMessage || "Could not find lockers.",
    };
  }
  return resp.data;
}

export async function getLockedLocker(
  token: string | null,
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

  const userIdApiResponse = await getUserIdFromToken(token);
  if (!userIdApiResponse.success) {
    return userIdApiResponse;
  }

  const resp = await axios.post<ApiResponse<Locker["id"]>>(
    `${baseUrl}/lockers/locked`,
    {
      userId: userIdApiResponse.payload,
      combination: combination,
    }
  );

  if (!resp.data?.success) {
    return {
      success: false,
      errorCode: resp.data?.errorCode || ErrorCodes.CouldNotFindLockers,
      errorMessage: resp.data?.errorMessage || "Could not find locker.",
    };
  }
  return resp.data;
}

export async function getLinks(
  token: string | null,
  lockerId?: number,
  _userId?: number
): Promise<ApiResponse<Link[]>> {
  /** Uses bearer token to gather all all links for specified non-locked locker id. */
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
  let userId = _userId;
  if (!userId) {
    const foundUserId = await getUserIdFromToken(token);
    if (!foundUserId.success) {
      return foundUserId;
    }
    userId = foundUserId.payload;
  }

  const lockerLinkedToUser = await axios.post(
    `${baseUrl}/lockers/userOwnsLocker`,
    {
      userId: userId,
      lockerId: lockerId,
    }
  );
  if (lockerLinkedToUser.status !== 200 && !lockerLinkedToUser.data?.success) {
    return {
      success: false,
      errorCode:
        lockerLinkedToUser.data?.errorCode || ErrorCodes.InvalidLockerId,
      errorMessage:
        lockerLinkedToUser.data?.errorMessage ||
        "LockerId not linked to userId.",
    };
  }

  const linksResp = await axios.get(`${baseUrl}/links/${lockerId}`);
  if (linksResp.status !== 200 && !linksResp.data?.success) {
    return {
      success: false,
      errorCode:
        linksResp.data?.errorCode ||
        ErrorCodes.UnexpectedErrorRaisedDuringDBCall,
      errorMessage:
        linksResp.data?.errorMessage ||
        "An unexpected error was raised while making a DB call.",
    };
  }

  return linksResp.data;
}

export async function getLockedLinks(
  token: string | null,
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

  const userIdApiResponse = await getUserIdFromToken(token);
  if (!userIdApiResponse.success) {
    return userIdApiResponse;
  }

  const lockedLockerResp = await axios.post(`${baseUrl}/lockers/locked/id`, {
    userId: userIdApiResponse.payload,
    combination: state.combination,
  });
  if (!lockedLockerResp.data?.success) {
    return {
      success: false,
      errorCode: lockedLockerResp.data?.errorCode || ErrorCodes.CouldNotUnlock,
      errorMessage:
        lockedLockerResp.data?.errorMessage || "Could not find/unlock locker.",
    };
  }

  return await getLinks(token, lockerId);
}

export async function addNewLink(
  token: string | null,
  lockerId: number,
  link: Link
): Promise<ApiResponse<number>> {
  if (mockData.use) {
    return { success: true, payload: generateRandomNumber() };
  }

  const foundUserId = await getUserIdFromToken(token);
  if (!foundUserId.success) {
    return foundUserId;
  }

  const addLinkResp = await axios.post(`${baseUrl}/links/add`, {
    lockerId: lockerId,
    name: link.name,
    url: link.url,
    tags: link.tags,
  });
  if (!addLinkResp.data.success) {
    return {
      success: false,
      errorCode: addLinkResp.data?.errorCode || ErrorCodes.CouldNotAddNewLink,
      errorMessage:
        addLinkResp.data?.errorMessage || "Link could not be added.",
    };
  }
  return addLinkResp.data;
}

export async function addNewLocker(
  token: string | null,
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

  const userIdApiResponse = await getUserIdFromToken(token);
  if (!userIdApiResponse.success) {
    return userIdApiResponse;
  }

  const addLockerResp = await axios.post(`${baseUrl}/lockers/new`, {
    userId: userIdApiResponse.payload,
    name: locker.name,
    locked: locker.locked,
    combination: locker.locked ? locker.combination : "",
  });
  if (!addLockerResp.data?.success) {
    return {
      success: false,
      errorCode:
        addLockerResp.data?.errorCode || ErrorCodes.CouldNotAddNewLocker,
      errorMessage:
        addLockerResp.data?.errorMessage ||
        "API ressponse is either undefined or unsuccessful, could not add a new locker.",
    };
  }
  return addLockerResp.data;
}

export async function authenticateLogin(
  username: string,
  password: string
): Promise<ApiResponse<AuthCreds>> {
  if (mockData.use) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + mockData.uid;
    return {
      success: true,
      payload: {
        token: mockData.uid,
        uid: mockData.uid,
      },
    };
  }
  return {
    success: false,
    errorCode: ErrorCodes.CouldNotLoginUser,
    errorMessage:
      "Could not login using the provided credentials. Please try again later.",
  };
}

export async function createAndAuthenticateLogin(
  username: string,
  password: string
): Promise<ApiResponse<AuthCreds>> {
  if (mockData.use) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + mockData.uid;
    return {
      success: true,
      payload: {
        token: mockData.uid,
        uid: mockData.uid,
      },
    };
  }
  return {
    success: false,
    errorCode: ErrorCodes.CouldNotCreateUser,
    errorMessage:
      "There was a problem creating an account. Please either try another username or try again later.",
  };
}
