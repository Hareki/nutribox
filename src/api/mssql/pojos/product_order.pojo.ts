export interface PoIProductOrder {
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

export interface PoIProductOrderInput
  extends Omit<PoIProductOrder, 'id' | 'created_at'> {}
