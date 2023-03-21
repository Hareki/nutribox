export interface IOrderStatus {
  // _id: Types.ObjectId;
  id: string;
  name: string;

  // NOTE: No need to include these, no task requires it for now
  // productOrders: IProductOrder[];
  // customersOrders: ICustomerOrder[];
}

export interface IOrderStatusInput extends Omit<IOrderStatus, '_id'> {}
