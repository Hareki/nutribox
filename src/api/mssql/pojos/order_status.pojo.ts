export interface PoIOrderStatus {
  id: string;
  name: string;
}

export interface PoIOrderStatusInput extends Omit<PoIOrderStatus, 'id'> {}
