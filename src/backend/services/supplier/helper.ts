import type { SupplierModel } from 'models/supplier.model';

export type SupplierDropDown = Pick<SupplierModel, 'id' | 'name'>;
