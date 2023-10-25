import type { z } from 'zod';

import { NewSupplierDtoSchema } from './newSupplier.dto';

export const UpdateSupplierDtoSchema = NewSupplierDtoSchema;
export type UpdateSupplierDto = z.infer<typeof UpdateSupplierDtoSchema>;
