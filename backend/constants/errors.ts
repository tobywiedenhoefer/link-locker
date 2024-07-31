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
  // backend errors
  BearerTokenNotPresent = 12,
  UnexpectedErrorRaised = 13,
  IncorrectRequest = 14,
  UnexpectedErrorRaisedWhileHashingPassword = 15,
}
