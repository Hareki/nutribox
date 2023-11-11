export const BASE_ROUTE = process.env.NEXT_PUBLIC_DOMAIN_URL; // Public route as well
export const BASE_STAFF_ROUTE = `${BASE_ROUTE}/staff`;

export const HOME_PAGE_ROUTE = `${BASE_ROUTE}/`;
export const SIGN_UP_ROUTE = `${BASE_ROUTE}/sign-up`;
export const SIGN_IN_ROUTE = `${BASE_ROUTE}/sign-in`;
export const SIGN_IN_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/sign-in`;

export const NOT_FOUND_ROUTE = `${BASE_ROUTE}/404`;
export const VERIFICATION_RESULT_ROUTE = `${BASE_ROUTE}/verification-result`;
export const VERIFICATION_RESULT_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/verification-result`;
export const FORGOT_PASSWORD_ROUTE = `${BASE_ROUTE}/forgot-password`;
export const RESET_PASSWORD_ROUTE = `${BASE_ROUTE}/reset-password`;
export const PRODUCT_DETAIL_ROUTE = `${BASE_ROUTE}/products/:slug`;

export const TESTING_ROUTE = `${BASE_ROUTE}/testing`;
export const TRANSLATION_ROUTE = `${BASE_ROUTE}/translation`;

export const PublicRoutes = [
  HOME_PAGE_ROUTE,
  SIGN_UP_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_IN_STAFF_ROUTE,
  NOT_FOUND_ROUTE,
  VERIFICATION_RESULT_ROUTE,
  VERIFICATION_RESULT_STAFF_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  RESET_PASSWORD_ROUTE,
  PRODUCT_DETAIL_ROUTE,
  TESTING_ROUTE,
  TRANSLATION_ROUTE,
];

export const NoAuthenticationOnlyRoutes = [
  SIGN_UP_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_IN_STAFF_ROUTE,
  VERIFICATION_RESULT_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  RESET_PASSWORD_ROUTE,
];

export const PROFILE_ROUTE = `${BASE_ROUTE}/profile`;
export const ADDRESSES_ROUTE = `${PROFILE_ROUTE}/addresses`;
export const ADDRESS_DETAIL_ROUTE = `${PROFILE_ROUTE}/addresses/:id`;
export const ORDERS_ROUTE = `${PROFILE_ROUTE}/orders`;
export const ORDER_DETAIL_ROUTE = `${ORDERS_ROUTE}/:id`;
export const CHECKOUT_ROUTE = `${BASE_ROUTE}/checkout`;

export const CustomerRoutes = [
  PROFILE_ROUTE,
  ADDRESSES_ROUTE,
  ADDRESS_DETAIL_ROUTE,
  ORDERS_ROUTE,
  ORDER_DETAIL_ROUTE,
  CHECKOUT_ROUTE,
];

export const DASHBOARD_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/dashboard`;
export const PROFILE_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/profile`;

export const CUSTOMERS_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/customers`;
export const CUSTOMER_DETAIL_STAFF_ROUTE = `${CUSTOMERS_STAFF_ROUTE}/:id`;

export const CUSTOMER_ORDERS_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/customer-orders`;
export const CUSTOMER_ORDER_DETAIL_STAFF_ROUTE = `${CUSTOMER_ORDERS_STAFF_ROUTE}/:id`;

export const EMPLOYEES_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/employees`;
export const EMPLOYEE_DETAIL_STAFF_ROUTE = `${EMPLOYEES_STAFF_ROUTE}/:id`;
export const NEW_EMPLOYEE_ROUTE = `${EMPLOYEES_STAFF_ROUTE}/new`;

export const CATEGORIES_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/categories`;
export const CATEGORY_DETAIL_ROUTE = `${CATEGORIES_STAFF_ROUTE}/:id`;
export const NEW_CATEGORY_ROUTE = `${CATEGORIES_STAFF_ROUTE}/new`;

export const PRODUCTS_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/products`;
export const PRODUCT_DETAIL_STAFF_ROUTE = `${PRODUCTS_STAFF_ROUTE}/:id`;
export const NEW_PRODUCT_DETAIL_ROUTE = `${PRODUCTS_STAFF_ROUTE}/new`;

export const SUPPLIERS_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/suppliers`;
export const SUPPLIER_DETAIL_STAFF_ROUTE = `${SUPPLIERS_STAFF_ROUTE}/:id`;
export const NEW_SUPPLIER_ROUTE = `${SUPPLIERS_STAFF_ROUTE}/new`;

export const STORE_DETAIL_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/stores/:id`;
export const COUNTER_STAFF_ROUTE = `${BASE_STAFF_ROUTE}/counter`;

export const NoStaffRoutes = [HOME_PAGE_ROUTE, PRODUCT_DETAIL_ROUTE];

export const ManagerRoutes = [
  DASHBOARD_STAFF_ROUTE,
  PROFILE_STAFF_ROUTE,

  CUSTOMERS_STAFF_ROUTE,
  CUSTOMER_DETAIL_STAFF_ROUTE,

  CUSTOMER_ORDERS_STAFF_ROUTE,
  CUSTOMER_ORDER_DETAIL_STAFF_ROUTE,

  EMPLOYEES_STAFF_ROUTE,
  EMPLOYEE_DETAIL_STAFF_ROUTE,
  NEW_EMPLOYEE_ROUTE,

  CATEGORIES_STAFF_ROUTE,
  CATEGORY_DETAIL_ROUTE,
  NEW_CATEGORY_ROUTE,

  PRODUCTS_STAFF_ROUTE,
  PRODUCT_DETAIL_STAFF_ROUTE,
  NEW_PRODUCT_DETAIL_ROUTE,

  SUPPLIERS_STAFF_ROUTE,
  SUPPLIER_DETAIL_STAFF_ROUTE,

  STORE_DETAIL_STAFF_ROUTE,
];

export const WarehouseManagerRoutes = [
  DASHBOARD_STAFF_ROUTE,
  PROFILE_STAFF_ROUTE,

  CUSTOMER_ORDERS_STAFF_ROUTE,
  CUSTOMER_ORDER_DETAIL_STAFF_ROUTE,

  PRODUCTS_STAFF_ROUTE,
  PRODUCT_DETAIL_STAFF_ROUTE,

  SUPPLIERS_STAFF_ROUTE,
  SUPPLIER_DETAIL_STAFF_ROUTE,
  NEW_SUPPLIER_ROUTE,
];

export const CashierRoutes = [
  DASHBOARD_STAFF_ROUTE,
  CUSTOMER_ORDERS_STAFF_ROUTE,

  PROFILE_STAFF_ROUTE,

  CUSTOMER_ORDER_DETAIL_STAFF_ROUTE,

  PRODUCTS_STAFF_ROUTE,
  PRODUCT_DETAIL_STAFF_ROUTE,

  COUNTER_STAFF_ROUTE,
];

export const ShipperRoutes = [
  CUSTOMER_ORDERS_STAFF_ROUTE,

  PROFILE_STAFF_ROUTE,

  CUSTOMER_ORDER_DETAIL_STAFF_ROUTE,
];
