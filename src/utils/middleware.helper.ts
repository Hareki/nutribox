import { NextResponse } from 'next/server';

import type { EmployeeRole } from 'backend/enums/entities.enum';
import type { MethodRoutePair, RequestMethod } from 'backend/types/utils';
import {
  CashierApiRoutes,
  CustomerApiRoutes,
  ManagerApiRoutes,
  ShipperApiRoutes,
  WarehouseManagerApiRoutes,
} from 'constants/routes.api.constant';
import {
  BASE_ROUTE,
  CashierRoutes,
  CustomerRoutes,
  DASHBOARD_STAFF_ROUTE,
  HOME_PAGE_ROUTE,
  ManagerRoutes,
  ORDERS_STAFF_ROUTE,
  ShipperRoutes,
  WarehouseManagerRoutes,
} from 'constants/routes.ui.constant';

export type Role = Exclude<
  keyof typeof EmployeeRole | 'CUSTOMER',
  'WAREHOUSE_STAFF'
>;

const LANGUAGE_PREFIXES = ['en'];

export const routeToRegexPattern = (route: string): RegExp => {
  let pattern = route
    .replace(/https?:\/\/[^/]+/, '') // strip out the domain
    .replace(/\//g, '\\/') // escape slashes
    .replace(/:\w+/g, '[^/]+'); // replace placeholders like :slug with a regex pattern

  // Create a regex group for optional language prefixes
  const langPrefixPattern =
    LANGUAGE_PREFIXES.length > 0
      ? `(\\/(${LANGUAGE_PREFIXES.join('|')}))?`
      : '';

  // Prefix with domain and optional language code
  pattern = `^${BASE_ROUTE.replace(
    new RegExp(`\\/(${LANGUAGE_PREFIXES.join('|')})?$`),
    '',
  )}${langPrefixPattern}${pattern}$`;

  return new RegExp(pattern);
};

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
      const routePattern = routeToRegexPattern(route);
      if (routePattern.test(url)) return true;
    } else if ('route' in route) {
      if (
        matchesPlaceHolderRoute(url, route.route) &&
        route.methods.includes(method)
      )
        return true;
    }
  }

  return false;
}

export const getDefaultCustomerRoute = () => HOME_PAGE_ROUTE;

export const getDefaultStaffRoute = (employeeRole: EmployeeRole) => {
  const defaultStaffRoute: Record<Exclude<Role, 'CUSTOMER'>, string> = {
    ['MANAGER']: DASHBOARD_STAFF_ROUTE,
    ['CASHIER']: DASHBOARD_STAFF_ROUTE,
    ['WAREHOUSE_MANAGER']: ORDERS_STAFF_ROUTE,
    ['SHIPPER']: ORDERS_STAFF_ROUTE,
  };
  const defaultRoute = defaultStaffRoute[employeeRole.toString()];
  if (!defaultRoute)
    throw new Error(`Invalid employee role: ${employeeRole.toString()}`);
  return defaultRoute;
};

export const removeQueryParameters = (urlString: string) => {
  const url = new URL(urlString);
  return url.origin + url.pathname;
};

export const shortenUrl = (url: string) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.pathname + urlObj.search + urlObj.hash;
  } catch (error) {
    return url;
  }
};

export const matchesPlaceHolderRoute = (
  url: string,
  route: string,
  urlShortened = false,
) => {
  let finalRoute = route;
  // If the URL is shortened, remove the domain from the route before matching
  if (urlShortened) {
    finalRoute = shortenUrl(route);
  }

  // Replace :id (or any other placeholder starting with ":") with a regex pattern
  const pattern = new RegExp(
    `^${finalRoute.replace(/:[a-zA-Z0-9_-]+/g, '([^/]+)')}$`,
  );
  return pattern.test(url);
};

export const insertId = (url: string, id: string | number): string => {
  return shortenUrl(url).replace(/:[a-zA-Z0-9_-]+/, id.toString());
};
