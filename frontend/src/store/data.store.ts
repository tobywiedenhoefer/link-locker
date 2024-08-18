import api from "../services/api.service";

import mockData, { generateRandomNumber } from "../constants/mockData";
import { ErrorCodes } from "../shared/errors";
import Link from "../types/link.type";
import LockerState from "../types/lockerState.type";
import ApiResponse from "../types/apiResponse.type";
import Locker from "../types/locker.type";
import AuthCreds from "../types/authCreds.type";

export async function getLockers(): Promise<ApiResponse<Locker[]>> {
  /** Uses bearer token to gather all lockers for the associated token's user.*/
  if (mockData.use) {
    return {
      success: true,
      payload: mockData.open.lockers,
    };
  }

  try {
    return await api.get("/lockers/").json<ApiResponse<Locker[]>>();
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
    const formData = new FormData();
    formData.append("combination", combination);
    return await api
      .post("/lockers/locked/id", {
        body: formData,
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
  lockerId?: number
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
      .post("/lockers/userOwnsLocker")
      .json<ApiResponse<boolean>>();
    if (!userOwnsLockerResponse.success) {
      return userOwnsLockerResponse;
    }
    return await api.get(`/links/${lockerId}`).json<ApiResponse<Link[]>>();
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
    const formData = new FormData();
    formData.append("combination", state.combination);
    const matchingLockerResp = await api
      .post("/lockers/locked/id", { body: formData })
      .json<ApiResponse<Locker[]>>();
    if (!matchingLockerResp.success) {
      return matchingLockerResp;
    }
    return await getLinks(lockerId);
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
    const formData = new FormData();
    formData.set("lockerId", lockerId.toString());
    formData.set("name", link.name);
    formData.set("url", link.url);
    formData.set("tags", JSON.stringify(link.tags));
    return await api
      .post("/links/add", { body: formData })
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
    const formData = new FormData();
    formData.set("name", locker.name);
    formData.set("locked", String(locker.locked));
    formData.set("combination", locker.locked ? locker.combination : "");
    return await api
      .post("/lockers/new", { body: formData })
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
): Promise<ApiResponse<AuthCreds>> {
  if (mockData.use) {
    return {
      success: true,
      payload: {
        token: mockData.token,
        uid: mockData.uid,
      },
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
    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);
    return await api
      .post("/user/login", { body: formData })
      .json<ApiResponse<AuthCreds>>();
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
): Promise<ApiResponse<AuthCreds>> {
  if (mockData.use) {
    return {
      success: true,
      payload: {
        token: mockData.token,
        uid: mockData.uid,
      },
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
    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);
    const createdUser = await api
      .post("/create-user", { body: formData })
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
