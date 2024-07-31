import mockData, { generateUUID } from "../constants/mockData";
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

export async function getLockers(
  token: string | null
): Promise<ApiResponse<Locker[]>> {
  /** Gets all non-locked lockers for the user */
  if (mockData.use) {
    return {
      success: true,
      payload: mockData.open.lockers,
    };
  }
  return {
    success: false,
    errorCode: ErrorCodes.CouldNotFindLockers,
    errorMessage: "Could not find lockers",
  };
}

export async function getLockedLocker(
  token: string | null,
  combination: string
): Promise<ApiResponse<string>> {
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

export async function getLinks(
  lockerId: string | undefined
): Promise<ApiResponse<Link[]>> {
  /** Gets all non-locked links for specified locker */
  let links: Array<Link> | undefined;
  if (typeof lockerId === "undefined") {
    return {
      success: false,
      errorCode: ErrorCodes.InvalidLockerId,
      errorMessage: `Invalid locker id: ${lockerId}`,
    };
  }
  if (mockData.use) {
    if (mockData.open.links.hasOwnProperty(lockerId)) {
      links = mockData.open.links[lockerId];
    }
  } else {
    throw new NotImplementedError("");
  }
  if (typeof links === "undefined") {
    return {
      success: false,
      errorCode: ErrorCodes.LockerDoesNotExist,
      errorMessage: "Locker does not exist for user.",
    };
  }
  return { success: true, payload: links };
}

export async function getLockedLinks(
  lockerId: string | undefined,
  state: LockerState
): Promise<ApiResponse<Link[]>> {
  /** Gets all links for a locker with the same unique combination */
  if (typeof lockerId === "undefined" || lockerId.length === 0) {
    return {
      success: false,
      errorCode: ErrorCodes.InvalidLockerId,
      errorMessage: `Invalid locker id: ${lockerId}`,
    };
  }
  if (!isValidDate(state.date)) {
    return {
      success: false,
      errorCode: ErrorCodes.CacheExpiredOrNotSet,
      errorMessage: "Cache is expired",
    };
  }
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
  throw new CombinationNotFoundError(
    `Combination not found for ${state.combination}`
  );
}

export async function addNewLink(
  token: string | null,
  lockerId: string,
  link: Link
): Promise<ApiResponse<string>> {
  if (mockData.use) {
    return { success: true, payload: generateUUID() };
  }
  return {
    success: false,
    errorCode: ErrorCodes.CouldNotAddNewLink,
    errorMessage:
      "We could not add a new link at this time. Please try again later.",
  };
}

export async function addNewLocker(
  token: string | null,
  locker: Locker
): Promise<ApiResponse<string>> {
  if (mockData.use) {
    const newLocker: Locker = {
      ...locker,
      id: generateUUID(),
    };
    const lockerType: keyof typeof mockData = locker.locked ? "locked" : "open";
    mockData[lockerType].lockers.push(newLocker);
    mockData[lockerType].links[newLocker.id] = [];
    return { success: true, payload: newLocker.id };
  }
  return {
    success: false,
    errorCode: ErrorCodes.CouldNotAddNewLocker,
    errorMessage:
      "We could not add a new locker at this time. Please try again later.",
  };
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
