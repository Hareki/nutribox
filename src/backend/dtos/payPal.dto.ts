import type { z } from 'zod';

import { CustomerOrderSchema } from 'models/customerOrder.model';

export const PayPalDtoSchema = CustomerOrderSchema.pick({
  onlineTransactionId: true,
  id: true,
}).required();

export type PayPalDto = z.infer<typeof PayPalDtoSchema>;
