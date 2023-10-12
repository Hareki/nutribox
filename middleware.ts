import { fromUnixTime } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

import type { EmployeeRole } from 'backend/enums/Entities.enum';
import type { MethodRoutePair, RequestMethod } from 'backend/types/utils';
import {
  API_BASE_ROUTE,
  CashierApiRoutes,
  CustomerApiRoutes,
  ManagerApiRoutes,
  PublicApiRoutes,
  ShipperApiRoutes,
  WarehouseManagerApiRoutes,
} from 'constants/routes.api.constant';
import {
  CashierRoutes,
  CustomerRoutes,
  ManagerRoutes,
  NOT_FOUND_ROUTE,
  PublicRoutes,
  ShipperRoutes,
  WarehouseManagerRoutes,
} from 'constants/routes.ui.constant';

type Role = Exclude<keyof typeof EmployeeRole | 'CUSTOMER', 'WAREHOUSE_STAFF'>;

export function isAuthorized(
  url: string,
  method: RequestMethod,
  role: Role,
): boolean {
  const roleToRoutesMap: Record<Role, (string | MethodRoutePair)[]> = {
    ['MANAGER']: [...ManagerRoutes, ...ManagerApiRoutes],
    ['CASHIER']: [...CashierRoutes, ...CashierApiRoutes],
    ['WAREHOUSE_MANAGER']: [
      ...WarehouseManagerRoutes,
      ...WarehouseManagerApiRoutes,
    ],
    ['SHIPPER']: [...ShipperRoutes, ...ShipperApiRoutes],
    ['CUSTOMER']: [...CustomerRoutes, ...CustomerApiRoutes],
  };

  const roleRoutes = roleToRoutesMap[role];

  for (const route of roleRoutes) {
    if (typeof route === 'string') {
      if (route === url) return true;
    } else if ('route' in route) {
      if (route.route === url && route.methods.includes(method)) return true;
    }
  }

  return false;
}

export default withAuth(
  async function middleware(req) {
    const { url, method } = req;
    const { token } = req.nextauth;

    if (
      PublicRoutes.includes(url) ||
      PublicApiRoutes.some(
        (routePair) =>
          routePair.route === url &&
          routePair.methods.includes(method as RequestMethod),
      )
    ) {
      return undefined; // Allow public route requests to pass through
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
