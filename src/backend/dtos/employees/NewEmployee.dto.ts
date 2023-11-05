import type { z } from 'zod';

import { EmployeeSchema } from 'models/employee.model';

export const NewEmployeeDtoSchema = EmployeeSchema.pick({
  birthday: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  personalId: true,
  role: true,
});

export type NewEmployeeDto = z.infer<typeof NewEmployeeDtoSchema>;
