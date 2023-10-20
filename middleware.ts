import { fromUnixTime } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

import type { RequestMethod } from 'backend/types/utils';
import {
  API_BASE_ROUTE,
  CashierApiRoutes,
  CustomerApiRoutes,
  ManagerApiRoutes,
  PublicApiRoutes,
  ShipperApiRoutes,
} from 'constants/routes.api.constant';
import {
  NOT_FOUND_ROUTE,
  NoAuthenticationOnlyRoutes,
  PublicRoutes,
  SIGN_IN_ROUTE,
  NoStaffRoutes,
  CustomerRoutes,
  ManagerRoutes,
  CashierRoutes,
  WarehouseManagerRoutes,
  ShipperRoutes,
  HOME_PAGE_ROUTE,
} from 'constants/routes.ui.constant';
import type { Role } from 'utils/middleware.helper';
import {
  isAuthorized,
  matchesPlaceHolderRoute,
  redirectToDefaultCustomerRoute,
  redirectToDefaultStaffRoute,
  removeQueryParameters,
  routeToRegexPattern,
} from 'utils/middleware.helper';

const PublicRoutePatterns = PublicRoutes.map(routeToRegexPattern);
const NoStaffRoutePatterns = NoStaffRoutes.map(routeToRegexPattern);
const NoAuthenticationOnlyRoutePatterns =
  NoAuthenticationOnlyRoutes.map(routeToRegexPattern);

export default withAuth(
  async function middleware(req) {
    const { url: rawUrl, method } = req;
    console.log('file: middleware.ts:40 - middleware - url:', rawUrl);

    const { token } = req.nextauth;
    const url = removeQueryParameters(rawUrl);
    const hasValidToken = !!token && fromUnixTime(token.exp || 0) > new Date();
    const employeeRole = token?.employeeRole;

    if (
      PublicRoutePatterns.some((pattern) => {
        const result = pattern.test(url);
        return result;
      }) ||
      PublicApiRoutes.some(
        (routePair) =>
          matchesPlaceHolderRoute(url, routePair.route) &&
          routePair.methods.includes(method as RequestMethod),
      )
    ) {
      // public route, but STAFF can't access once signed in
      const isNoStaffRoute = NoStaffRoutePatterns.some((pattern) =>
        pattern.test(url),
      );
      if (isNoStaffRoute && employeeRole && hasValidToken) {
        return redirectToDefaultStaffRoute(employeeRole.toString() as any);
      }

      // public route, but EVERYONE can't access once signed in
      const isNoAuthenticationOnlyRoute =
        NoAuthenticationOnlyRoutePatterns.some((pattern) => pattern.test(url));

      if (isNoAuthenticationOnlyRoute && hasValidToken) {
        if (employeeRole) {
          return redirectToDefaultStaffRoute(employeeRole.toString() as any);
        } else {
          return redirectToDefaultCustomerRoute();
        }
      }
      return undefined;
    }

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
      // console.log('hehe');
      return NextResponse.redirect(NOT_FOUND_ROUTE);
    }

    const isApiRoute = url.startsWith(API_BASE_ROUTE);
    if (!isApiRoute) {
      return NextResponse.redirect(SIGN_IN_ROUTE);
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
  // matcher: ['/((?!404|_next/static|_next/image|favicon.ico|assets/).*)'],
  matcher: ['/((?!404|_next/static|_next/image|favicon.ico|assets/).*)', '/'],
};
