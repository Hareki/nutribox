export const layoutConstant = {
  topbarHeight: 40,
  headerHeight: 80,
  mobileNavHeight: 64,
  containerWidth: 1200,
  mobileHeaderHeight: 64,
  grocerySidenavWidth: 280,
};

export const paginationConstant = {
  docsPerPage: 6,
  infiniteDocsPerPage: 9999,
};

export const IKPublicContext = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT_URL,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  authenticationEndpoint:
    process.env.NEXT_PUBLIC_IMAGEKIT_AUTHENTICATION_ENDPOINT,
};

export const PREPARATION_TIME = 10; // in minutes
export const MAX_DELIVERY_RANGE = 10; // in km