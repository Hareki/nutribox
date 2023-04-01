export const LayoutConstant = {
  topbarHeight: 40,
  headerHeight: 80,
  mobileNavHeight: 64,
  containerWidth: 1200,
  mobileHeaderHeight: 64,
  grocerySidenavWidth: 280,
};

export const ProductCarouselLimit = 6;

export const ProfileInfiniteProductConstant = {
  docsPerPage: 6,
  infiniteDocsPerPage: 9999,
};

export const ProfileOrderPaginationConstant = {
  docsPerPage: 5,
  infiniteDocsPerPage: 9999,
};

export const AdminMainTablePaginationConstant = {
  docsPerPage: 9,
  infiniteDocsPerPage: 9999,
};

export const AdminSubTablePaginationConstant = {
  docsPerPage: 4,
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
export const MAX_DELIVERY_DURATION = 45; // in minutes

export const OrderStatus = Object.freeze({
  Pending: { id: '641ae36318e353f785a7f695', name: 'Chờ xác nhận' },
  Processing: { id: '641ae39318e353f785a7f696', name: 'Đang xử lý' },
  Delivering: { id: '641ae3b318e353f785a7f697', name: 'Đang giao hàng' },
  Delivered: { id: '641ae3cd18e353f785a7f699', name: 'Giao thành công' },
  Cancelled: { id: '641ae3c218e353f785a7f698', name: 'Đã hủy đơn' },
});

export const AllStatusIdArray = Object.freeze([
  OrderStatus.Pending.id, // 0
  OrderStatus.Processing.id, // 1
  OrderStatus.Delivering.id, // 2
  OrderStatus.Delivered.id, // 3
  OrderStatus.Cancelled.id, // 4
]);

export const CancelIndexThreshHold = 1;

export const StoreId = '641ff62a1af60afc9423cbea';
