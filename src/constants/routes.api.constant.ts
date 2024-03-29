import { BASE_ROUTE } from './routes.ui.constant';

import type { MethodRoutePair } from 'backend/types/utils';

export const API_BASE_ROUTE = `${BASE_ROUTE}/api`;
export const API_BASE_STAFF_ROUTE = `${API_BASE_ROUTE}/staff`;

export const PRODUCTS_API_ROUTE = `${API_BASE_ROUTE}/products`;
export const CATEGORIES_API_ROUTE = `${API_BASE_ROUTE}/categories`;
export const PRODUCT_DETAIL_API_ROUTE = `${PRODUCTS_API_ROUTE}/:id`;
export const CATEGORY_DETAIL_API_ROUTE = `${API_BASE_ROUTE}/categories/:id`;
export const NEW_PRODUCTS_API_ROUTE = `${PRODUCTS_API_ROUTE}/new`;
export const HOT_PRODUCTS_API_ROUTE = `${PRODUCTS_API_ROUTE}/hot`;
export const SLUGS_API_ROUTE = `${PRODUCTS_API_ROUTE}/slugs`;
export const SIGN_UP_API_ROUTE = `${API_BASE_ROUTE}/sign-up`;
export const VERIFY_EMAIL_API_ROUTE = `${API_BASE_ROUTE}/verify-email`;
export const RESEND_VERIFICATION_EMAIL_API_ROUTE = `${API_BASE_ROUTE}/resend-verification-email`;
export const FORGOT_PASSWORD_API_ROUTE = `${API_BASE_ROUTE}/password/forgot`;
export const RESET_PASSWORD_API_ROUTE = `${API_BASE_ROUTE}/password/reset`;
export const STORE_DETAIL_API_ROUTE = `${API_BASE_ROUTE}/stores/:id`;

export const TESTING_API_ROUTE = `${API_BASE_ROUTE}/testing`;

export const EMPLOYEES_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/employees`;

export const PublicApiRoutes: MethodRoutePair[] = [
  {
    methods: ['GET'],
    route: PRODUCTS_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: CATEGORIES_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: CATEGORY_DETAIL_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: PRODUCT_DETAIL_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: NEW_PRODUCTS_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: HOT_PRODUCTS_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: SLUGS_API_ROUTE,
  },
  {
    methods: ['POST'],
    route: SIGN_UP_API_ROUTE,
  },
  {
    methods: ['POST'],
    route: VERIFY_EMAIL_API_ROUTE,
  },
  {
    methods: ['POST'],
    route: FORGOT_PASSWORD_API_ROUTE,
  },
  {
    methods: ['PATCH'],
    route: RESET_PASSWORD_API_ROUTE,
  },
  {
    methods: ['POST'],
    route: TESTING_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: STORE_DETAIL_API_ROUTE,
  },
  {
    methods: ['POST'],
    route: RESEND_VERIFICATION_EMAIL_API_ROUTE,
  },
  {
    methods: ['PUT'],
    route: EMPLOYEES_API_STAFF_ROUTE,
  },
];

export const PROFILE_API_ROUTE = `${API_BASE_ROUTE}/profile`;
export const PROFILE_AVATAR_API_ROUTE = `${API_BASE_ROUTE}/profile/avatar`;
export const MENU_COUNT_API_ROUTE = `${PROFILE_API_ROUTE}/menu-count`;
export const ADDRESSES_API_ROUTE = `${PROFILE_API_ROUTE}/addresses`;
export const ADDRESS_DETAIL_API_ROUTE = `${ADDRESSES_API_ROUTE}/:id`;

export const ORDERS_API_ROUTE = `${PROFILE_API_ROUTE}/orders`;
export const ORDER_DETAIL_API_ROUTE = `${ORDERS_API_ROUTE}/:id`;

export const CART_ITEMS_API_ROUTE = `${API_BASE_ROUTE}/cart-items`;
export const CHECKOUT_API_ROUTE = `${API_BASE_ROUTE}/checkout`;
export const CHECKOUT_VALIDATION_API_ROUTE = `${CHECKOUT_API_ROUTE}/validate`;
export const CHECKOUT_ONLINE_PAYMENT_API_ROUTE = `${CHECKOUT_API_ROUTE}/online-payment`;
export const CHECKOUT_CURRENCY_EXCHANGE_API_ROUTE = `${CHECKOUT_API_ROUTE}/currency-exchange`;

export const CustomerApiRoutes: MethodRoutePair[] = [
  {
    methods: ['GET', 'PUT', 'PATCH'],
    route: PROFILE_API_ROUTE,
  },
  {
    methods: ['PUT'],
    route: PROFILE_AVATAR_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: MENU_COUNT_API_ROUTE,
  },
  {
    methods: ['GET', 'POST'],
    route: ADDRESSES_API_ROUTE,
  },
  {
    methods: ['GET', 'PUT', 'DELETE'],
    route: ADDRESS_DETAIL_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: ORDERS_API_ROUTE,
  },
  {
    methods: ['GET', 'PATCH'],
    route: ORDER_DETAIL_API_ROUTE,
  },
  {
    methods: ['GET', 'POST'],
    route: CART_ITEMS_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: CHECKOUT_VALIDATION_API_ROUTE,
  },
  {
    methods: ['POST'],
    route: CHECKOUT_API_ROUTE,
  },
  {
    methods: ['PATCH'],
    route: CHECKOUT_ONLINE_PAYMENT_API_ROUTE,
  },
  {
    methods: ['GET'],
    route: CHECKOUT_CURRENCY_EXCHANGE_API_ROUTE,
  },
];

export const DASHBOARD_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/dashboard`;
export const MONTHLY_PROFITS_API_STAFF_ROUTE = `${DASHBOARD_API_STAFF_ROUTE}/monthly-profits`;
export const PROFILE_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/profile`;
export const PROFILE_AVATAR_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/profile/avatar`;

export const CUSTOMERS_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/customers`;
export const CUSTOMER_DETAIL_API_STAFF_ROUTE = `${CUSTOMERS_API_STAFF_ROUTE}/:id`;

export const CUSTOMER_ORDERS_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/customer-orders`;
export const CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE = `${CUSTOMER_ORDERS_API_STAFF_ROUTE}/:id`;
export const EXPORT_ORDER_DETAIL_API_STAFF_ROUTE = `${CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE}/export-order-details`;

export const EMPLOYEE_DETAIL_API_STAFF_ROUTE = `${EMPLOYEES_API_STAFF_ROUTE}/:id`;

export const CATEGORIES_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/categories`;
export const CATEGORY_DETAIL_API_STAFF_ROUTE = `${CATEGORIES_API_STAFF_ROUTE}/:id`;

export const PRODUCTS_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/products`;
export const PRODUCT_DETAIL_API_STAFF_ROUTE = `${PRODUCTS_API_STAFF_ROUTE}/:id`;
export const IMPORT_PRODUCT_API_STAFF_ROUTE = `${PRODUCT_DETAIL_API_STAFF_ROUTE}/import`;

export const IMPORT_ORDERS_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/import-orders`;

export const SUPPLIERS_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/suppliers`;
export const SUPPLIER_DETAIL_API_STAFF_ROUTE = `${SUPPLIERS_API_STAFF_ROUTE}/:id`;

export const STORE_DETAIL_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/stores/:id`;

export const COUNTER_API_STAFF_ROUTE = `${API_BASE_STAFF_ROUTE}/counter`;

export const StaffRestrictedApiRoutes: MethodRoutePair[] = [];

export const ManagerApiRoutes: MethodRoutePair[] = [
  {
    methods: ['GET'],
    route: DASHBOARD_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: MONTHLY_PROFITS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'PUT', 'PATCH'],
    route: PROFILE_API_STAFF_ROUTE,
  },
  {
    methods: ['PUT'],
    route: PROFILE_AVATAR_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: CUSTOMERS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: CUSTOMER_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: CUSTOMER_ORDERS_API_STAFF_ROUTE,
  },
  {
    // FIXME Manager should be allowed to use PATCH method, just for development
    methods: ['GET'],
    route: CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'POST'],
    route: EMPLOYEES_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'PUT', 'DELETE'],
    route: EMPLOYEE_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'POST'],
    route: CATEGORIES_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'PUT', 'DELETE'],
    route: CATEGORY_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'POST'],
    route: PRODUCTS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    route: PRODUCT_DETAIL_API_STAFF_ROUTE,
  },
  // {
  //   methods: ['POST'],
  //   route: IMPORT_PRODUCT_API_STAFF_ROUTE,
  // },
  {
    methods: ['GET'],
    route: IMPORT_ORDERS_API_STAFF_ROUTE,
  },
  // FIXME Manager should be allowed to use  POST method, just for development
  {
    methods: ['GET'],
    route: SUPPLIERS_API_STAFF_ROUTE,
  },
  // FIXME Manager should be allowed to use PUT method, just for development
  {
    methods: ['GET'],
    route: SUPPLIER_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'PUT', 'PATCH'],
    route: STORE_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: EXPORT_ORDER_DETAIL_API_STAFF_ROUTE,
  },
];

export const WarehouseManagerApiRoutes: MethodRoutePair[] = [
  {
    methods: ['GET'],
    route: DASHBOARD_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: MONTHLY_PROFITS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'PUT', 'PATCH'],
    route: PROFILE_API_STAFF_ROUTE,
  },
  {
    methods: ['PUT'],
    route: PROFILE_AVATAR_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: CUSTOMER_ORDERS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: PRODUCTS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'POST', 'PATCH'],
    route: PRODUCT_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['POST'],
    route: IMPORT_PRODUCT_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: IMPORT_ORDERS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'POST'],
    route: SUPPLIERS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'PUT', 'DELETE'],
    route: SUPPLIER_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: EXPORT_ORDER_DETAIL_API_STAFF_ROUTE,
  },
];

export const CashierApiRoutes: MethodRoutePair[] = [
  {
    methods: ['GET'],
    route: DASHBOARD_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: MONTHLY_PROFITS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'PUT', 'PATCH'],
    route: PROFILE_API_STAFF_ROUTE,
  },
  {
    methods: ['PUT'],
    route: PROFILE_AVATAR_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: CUSTOMER_ORDERS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'PATCH', 'PUT'],
    route: CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: PRODUCTS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: IMPORT_ORDERS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: PRODUCT_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['POST'],
    route: COUNTER_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: EXPORT_ORDER_DETAIL_API_STAFF_ROUTE,
  },
];

export const ShipperApiRoutes: MethodRoutePair[] = [
  {
    methods: ['GET', 'PUT', 'PATCH'],
    route: PROFILE_API_STAFF_ROUTE,
  },
  {
    methods: ['PUT'],
    route: PROFILE_AVATAR_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: CUSTOMER_ORDERS_API_STAFF_ROUTE,
  },
  {
    methods: ['GET', 'PATCH', 'PUT'],
    route: CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE,
  },
  {
    methods: ['GET'],
    route: EXPORT_ORDER_DETAIL_API_STAFF_ROUTE,
  },
];
