export enum EmployeeRole {
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  WAREHOUSE_STAFF = 'WAREHOUSE_STAFF',
  SHIPPER = 'SHIPPER',
}

export enum AddressTitle {
  OFFICE = 'OFFICE',
  HOME = 'HOME',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  COD = 'COD',
  MoMo = 'MoMo',
  VNPAY = 'VNPAY',
}
