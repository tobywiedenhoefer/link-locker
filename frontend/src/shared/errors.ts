export enum ErrorCodes {
  LockerDoesNotExist = 1,
  LinkDoesNotExist = 2,
  CouldNotAddNewLocker = 3,
  CouldNotAddNewLink = 4,
  CouldNotUnlock = 5,
  InvalidLockerId = 6,
  CouldNotLoginUser = 7,
  CouldNotCreateUser = 8,
  CouldNotFindLockers = 9,
  CoulsNotFindLinks = 10,
  CacheExpiredOrNotSet = 11,
}

export class CombinationNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CombinationNotFoundError.prototype);
  }
}

export class UIDNotSet extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, UIDNotSet.prototype);
  }
}

export class NotImplementedError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}
