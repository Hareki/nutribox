import duotone from 'components/icons/duotone';

export const navigations = [
  { type: 'label', label: 'Bảng điều khiển' },
  { name: 'Thống kê', icon: duotone.Dashboard, path: '/admin/dashboard' },
  {
    name: 'Sản phẩm',
    icon: duotone.Products,
    path: '/admin/product',
  },
  {
    name: 'Đơn hàng',
    icon: duotone.Order,
    path: '/admin/order',
  },
  {
    name: 'Nhà cung cấp',
    icon: duotone.Seller,
    path: '/admin/supplier',
  },

  { name: 'Tài khoản', icon: duotone.Customers, path: '/admin/account' },
  {
    name: 'Cài đặt',
    icon: duotone.SiteSetting,
    path: '/admin/store-setting',
  },
  { name: 'Đăng xuất', icon: duotone.Session, isSignOut: true },
];
