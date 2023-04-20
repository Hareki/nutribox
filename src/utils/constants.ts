export const LayoutConstant = {
  topbarHeight: 40,
  headerHeight: 80,
  mobileNavHeight: 64,
  containerWidth: 1200,
  mobileHeaderHeight: 64,
  grocerySidenavWidth: 280,
};

export const ProductCarouselLimit = 6;
export const RelatedProductsLimit = 4;

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
  Pending: { id: '57379784-B3F7-4717-9155-25ED93EEF78D', name: 'Chờ xác nhận' },
  Processing: {
    id: 'F2E5678D-19E0-4BE0-BB0D-FDC20E0989D4',
    name: 'Đang xử lý',
  },
  Delivering: {
    id: '741AB523-D545-4C8A-97C8-0231802CF0F3',
    name: 'Đang giao hàng',
  },
  Delivered: {
    id: '83B6EFB9-2A3E-464A-B31A-866F3A0D9274',
    name: 'Giao thành công',
  },
  Cancelled: { id: 'AD8B7716-CB32-4D4B-98B2-3EA4367B9CD5', name: 'Đã hủy đơn' },
});

export const Role = {
  Admin: { id: '24B905F5-37CD-46D3-B8EE-05C85477BC54', name: 'ADMIN' },
  Customer: { id: '4AE9CDC7-FE33-4486-81BE-D8916F1402C9', name: 'CUSTOMER' },
} as const;

export const AllStatusIdArray = Object.freeze([
  OrderStatus.Pending.id, // 0
  OrderStatus.Processing.id, // 1
  OrderStatus.Delivering.id, // 2
  OrderStatus.Delivered.id, // 3
  OrderStatus.Cancelled.id, // 4
]);

export const CancelIndexThreshHold = 1;

export const StoreId = '641ff62a1af60afc9423cbea';
