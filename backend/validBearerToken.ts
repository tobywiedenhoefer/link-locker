import { ErrorCodes } from "./constants/errors";
import ApiResponse from "./types/ApiResponse.type";

export default function validBearerToken(
  auth?: string
): ApiResponse<undefined> {
  if (!auth || !auth.includes(" ")) {
    return {
      success: false,
      errorCode: ErrorCodes.BearerTokenNotPresent,
      errorMessage: "Unauthorized.",
    };
  }
  try {
    const token = auth.split(" ")[1];
    // check against server
    return {
      success: true,
      payload: undefined,
    };
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.UnexpectedErrorRaised,
      errorMessage: `An unexpected error occurred while trying to authorize request. Error: ${e}`,
    };
  }
}
