export interface IProductOrder {
  id: string;
  product_id: string;
  supplier_id: string;

  import_quantity: number;
  remaining_quantity: number;
  import_date: Date | string;
  expiration_date: Date | string;
  unit_import_price: number;

  created_at: Date | string;
}

export interface IProductOrderInput
  extends Omit<IProductOrder, 'id' | 'created_at'> {}
