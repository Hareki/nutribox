export const BASE_ROUTE = process.env.NEXT_PUBLIC_DOMAIN_URL;
export const API_BASE_ROUTE = `${BASE_ROUTE}api/`;
export const API_TESTING_ROUTE = `${API_BASE_ROUTE}testing`;

export const API_STAFF_ROUTE = `${API_BASE_ROUTE}staff/`;

export const NOT_FOUND_ROUTE = `${BASE_ROUTE}404/`;

export const PRODUCT_DETAIL_ROUTE = `${BASE_ROUTE}products/`; // [slug]
export const CHECKOUT_ROUTE = `${BASE_ROUTE}checkout/`;
export const LOGIN_ROUTE = `${BASE_ROUTE}login/`;
export const SIGN_UP_ROUTE = `${BASE_ROUTE}sign-up/`;

export const PROFILE_ROUTE = `${BASE_ROUTE}profile/`;
export const PROFILE_ADDRESS_ROUTE = `${PROFILE_ROUTE}address/`;
export const PROFILE_ORDER_ROUTE = `${PROFILE_ROUTE}order/`; // index, [id]
export const FORGOT_PASSWORD_ROUTE = `${PROFILE_ROUTE}forgot-password/`;
export const RESET_PASSWORD_ROUTE = `${PROFILE_ROUTE}reset-password/`;
export const VERIFY_ROUTE = `${PROFILE_ROUTE}verification-result/`;

export const API_AUTH_NEXT_AUTH_ROUTE = `${API_BASE_ROUTE}auth/`; // [..nextauth]
export const API_AUTH_IMAGE_KIT_ROUTE = `${API_BASE_ROUTE}auth/image-kit/`;

export const API_CATEGORY_ROUTE = `${API_BASE_ROUTE}categories/`; // index, [id]
export const API_PRODUCTS_ROUTE = `${API_BASE_ROUTE}products/`; // index, [id]
export const API_STORE_ROUTE = `${API_BASE_ROUTE}stores/`; // [id]
export const API_CART_ROUTE = `${API_BASE_ROUTE}cart/`;
export const API_CHECKOUT_ROUTE = `${API_BASE_ROUTE}checkout/`;
export const API_SIGN_UP_ROUTE = `${API_BASE_ROUTE}sign-up/`;
export const API_DISTANCE_ROUTE = `${API_BASE_ROUTE}check-distance/`;

export const API_PROFILE_ROUTE = `${API_BASE_ROUTE}profile/`;
export const API_FORGOT_PASSWORD = `${API_BASE_ROUTE}forgot-password/`;
export const API_RESET_PASSWORD = `${API_BASE_ROUTE}reset-password/`;
export const API_SEND_VERIFICATION_EMAIL = `${API_BASE_ROUTE}send-verification-email/`;
export const API_VERIFY_ACCOUNT = `${API_BASE_ROUTE}verify/`;
export const API_CHECK_VERIFICATION_STATUS = `${API_BASE_ROUTE}check-verification-status/`;
