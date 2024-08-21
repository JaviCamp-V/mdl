import AccessLevel from '@/types/Auth/AccessLevel';
import ErrorResponse from '@/types/common/ErrorResponse';
import { getSession } from '@/utils/authUtils';
import { generateErrorResponse } from '@/utils/handleError';

/***
 * This function is a middleware that checks if the user is authenticated and has the required access level.
 * If the user is authenticated and has the required access level, it will call the action function.
 * If the user is not authenticated, it will return a 401 error response.
 * If the user is authenticated but does not have the required access level, it will return a 403 error response.
 * @param actionFunction The function to be called if the user is authenticated and has the required access level.
 * @param accessLevel The required access level for the user. If not provided, any authenticated user can access the function.
 * @param defaultValue The default value to be returned if the user is not authenticated or does not have the required access level.
 * @returns The action function with the authentication middleware.
 */
const withAuthMiddleware = <T extends any[], U>(
  actionFunction: (...args: T) => Promise<U>,
  accessLevel?: AccessLevel,
  defaultValue?: U
): ((...args: T) => Promise<U | ErrorResponse>) => {
  return async (...args: T) => {
    const session = await getSession();
    const cond1 = session?.user;
    const cond2 = cond1 && (!accessLevel || session.user?.accessLevels?.includes(accessLevel));
    if (cond2) {
      return await actionFunction(...args);
    } else {
      return defaultValue ?? generateErrorResponse(cond1 ? 403 : 401);
    }
  };
};

export default withAuthMiddleware;
