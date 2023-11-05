import type { z } from 'zod';

import { EmployeeSchema } from 'models/employee.model';

export const UpdateEmployeeDtoSchema = EmployeeSchema.pick({
  birthday: true,
  firstName: true,
  lastName: true,
  phone: true,
  personalId: true,
});

export type UpdateEmployeeDto = z.infer<typeof UpdateEmployeeDtoSchema>;
