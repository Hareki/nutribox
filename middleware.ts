import { fromUnixTime } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

import type { RequestMethod } from 'backend/types/utils';
import { API_BASE_ROUTE, PublicApiRoutes } from 'constants/routes.api.constant';
import { NOT_FOUND_ROUTE, PublicRoutes } from 'constants/routes.ui.constant';
import type { Role } from 'utils/middleware.helper';
import {
  isAuthorized,
  matchesRoute,
  removeQueryParameters,
} from 'utils/middleware.helper';

export default withAuth(
  async function middleware(req) {
    const { url: rawUrl, method } = req;
    const { token } = req.nextauth;
    const url = removeQueryParameters(rawUrl);

    if (
      PublicRoutes.includes(url) ||
      PublicApiRoutes.some(
        (routePair) =>
          matchesRoute(url, routePair.route) &&
          routePair.methods.includes(method as RequestMethod),
      )
    ) {
      return undefined;
    }

    const employeeRole = token?.employeeRole;
    const hasValidToken = !!token && fromUnixTime(token.exp || 0) > new Date();

    if (hasValidToken) {
      if (
        isAuthorized(
          url,
          method as RequestMethod,
          (employeeRole || 'CUSTOMER').toString() as Role,
        )
      ) {
        return undefined;
      }
    }

    const isApiRoute = url.startsWith(API_BASE_ROUTE);
    if (!isApiRoute) {
      return NextResponse.redirect(NOT_FOUND_ROUTE);
    }

    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: 'Unauthorized',
        code: StatusCodes.UNAUTHORIZED,
      }),
      {
        status: StatusCodes.UNAUTHORIZED,
        headers: { 'content-type': 'application/json' },
      },
    );
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: '/((?!404|assets/).*)',
};
