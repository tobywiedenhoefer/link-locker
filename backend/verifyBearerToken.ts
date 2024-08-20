import { ErrorCodes } from "./constants/errors";
import ApiResponse from "./types/ApiResponse.type";

import { getUnexpiredTokens } from "./src/db/queries/token";

export default async function verifyBearerToken(
  auth?: string
): Promise<ApiResponse<number>> {
  if (!auth || !auth.includes(" ")) {
    return {
      success: false,
      errorCode: ErrorCodes.CacheExpiredOrNotSet,
      errorMessage: "Unauthorized.",
    };
  }
  try {
    const token = auth.split(" ")[1];
    const unexpiredTokensQuery = await getUnexpiredTokens(token);
    if (unexpiredTokensQuery.length === 0) {
      return {
        success: false,
        errorCode: ErrorCodes.CacheExpiredOrNotSet,
        errorMessage: `Could not find a a bearer token that matches ${token}`,
      };
    }
    return {
      success: true,
      payload: unexpiredTokensQuery[0].user_id,
    };
  } catch (e) {
    return {
      success: false,
      errorCode: ErrorCodes.UnexpectedErrorRaised,
      errorMessage: `An unexpected error occurred while trying to authorize request. Error: ${e}`,
    };
  }
}
