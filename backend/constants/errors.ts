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
  BearerTokenNotPresent = 112,
  UnexpectedErrorRaised = 113,
  IncorrectRequest = 114,
  UnexpectedErrorRaisedWhileHashingPassword = 115,
  UnexpectedErrorRaisedWhileCreatingUser = 116,
  CouldNotFindUserIdInDatabase = 117,
  CouldNotFindUsernameInDatabase = 118,
  ProblemFindingLockerInDatabase = 119,
  PasswordDoesNotMatchHash = 120,
  DBQueryReturnedNonUniqueOrNoRows = 121,
}
