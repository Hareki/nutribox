export interface IOrderStatus {
  id: string;
  name: string;
}

export interface IOrderStatusInput extends Omit<IOrderStatus, 'id'> {}
