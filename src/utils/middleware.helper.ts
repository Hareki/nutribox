import type { EmployeeRole } from 'backend/enums/Entities.enum';
import type { MethodRoutePair, RequestMethod } from 'backend/types/utils';
import {
  CashierApiRoutes,
  CustomerApiRoutes,
  ManagerApiRoutes,
  ShipperApiRoutes,
  WarehouseManagerApiRoutes,
} from 'constants/routes.api.constant';
import {
  CashierRoutes,
  CustomerRoutes,
  ManagerRoutes,
  ShipperRoutes,
  WarehouseManagerRoutes,
} from 'constants/routes.ui.constant';

export type Role = Exclude<
  keyof typeof EmployeeRole | 'CUSTOMER',
  'WAREHOUSE_STAFF'
>;

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

export const removeQueryParameters = (urlString) => {
  const url = new URL(urlString);
  return url.origin + url.pathname;
};

export const matchesRoute = (url: string, route: string) => {
  // Replace :id (or any other placeholder starting with ":") with a regex pattern
  const pattern = new RegExp(`^${route.replace(/:\w+/g, '([^/]+)')}$`);
  return pattern.test(url);
};