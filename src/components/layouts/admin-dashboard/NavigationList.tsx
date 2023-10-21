import type { SvgIconProps } from '@mui/material';

import type { EmployeeRole } from 'backend/enums/entities.enum';
import duotone from 'components/icons/duotone';
import {
  CUSTOMERS_STAFF_ROUTE,
  DASHBOARD_STAFF_ROUTE,
  EMPLOYEES_STAFF_ROUTE,
  ORDERS_STAFF_ROUTE,
  PRODUCTS_STAFF_ROUTE,
  STORE_DETAIL_STAFF_ROUTE,
  SUPPLIERS_STAFF_ROUTE,
} from 'constants/routes.ui.constant';

export type NavigationItem = {
  name: string;
  icon?: (props: SvgIconProps) => JSX.Element;
  path?: string;
  type?: 'label' | 'signOut';
};

export type SideBarRole = keyof typeof EmployeeRole;

export const navigations: Record<SideBarRole, NavigationItem[]> = {
  MANAGER: [
    { type: 'label', name: 'Bảng điều khiển' },
    { name: 'Thống kê', icon: duotone.Dashboard, path: DASHBOARD_STAFF_ROUTE },
    {
      name: 'Sản phẩm',
      icon: duotone.Products,
      path: PRODUCTS_STAFF_ROUTE,
    },
    {
      name: 'Đơn hàng',
      icon: duotone.Order,
      path: ORDERS_STAFF_ROUTE,
    },
    {
      name: 'Nhân viên',
      icon: duotone.UserTie,
      path: EMPLOYEES_STAFF_ROUTE,
    },
    {
      name: 'Khách hàng',
      icon: duotone.Customers,
      path: CUSTOMERS_STAFF_ROUTE,
    },
    {
      name: 'Nhà cung cấp',
      icon: duotone.Seller,
      path: SUPPLIERS_STAFF_ROUTE,
    },
    {
      name: 'Cài đặt cửa hàng',
      icon: duotone.Settings,
      path: STORE_DETAIL_STAFF_ROUTE,
    },
    { type: 'signOut', name: 'Đăng xuất', icon: duotone.Session },
  ],
  CASHIER: [{ type: 'signOut', name: 'Đăng xuất', icon: duotone.Session }],
  SHIPPER: [{ type: 'signOut', name: 'Đăng xuất', icon: duotone.Session }],
  WAREHOUSE_MANAGER: [
    { type: 'signOut', name: 'Đăng xuất', icon: duotone.Session },
  ],
  WAREHOUSE_STAFF: [],
};
