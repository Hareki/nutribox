import type { z } from 'zod';

import { CustomerOrderSchema } from 'models/customerOrder.model';

export const CustomerCancelOrderDtoSchema = CustomerOrderSchema.pick({
  cancellationReason: true,
});

export type CustomerCancelOrderDto = z.infer<
  typeof CustomerCancelOrderDtoSchema
>;
