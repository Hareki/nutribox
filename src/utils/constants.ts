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

export const OrderStatus = Object.freeze({
  Pending: { id: '641ae36318e353f785a7f695', name: 'Chờ xác nhận' },
  Processing: { id: '641ae39318e353f785a7f696', name: 'Đang xử lý' },
  Delivering: { id: '641ae3b318e353f785a7f697', name: 'Đang giao hàng' },
  Delivered: { id: '641ae3cd18e353f785a7f699', name: 'Giao thành công' },
  Cancelled: { id: '641ae3c218e353f785a7f698', name: 'Đã hủy đơn' },
});
