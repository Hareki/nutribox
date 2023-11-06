import { z } from 'zod';

import { EmployeeRole } from 'backend/enums/entities.enum';
import { AccountSchema } from 'models/account.model';
import { EmployeeSchema } from 'models/employee.model';

export const NewEmployeeDtoSchema = EmployeeSchema.pick({
  birthday: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  personalId: true,
  role: true,
}).extend({
  disabled: AccountSchema.shape.disabled,
});

export const NewEmployeeFormSchema = NewEmployeeDtoSchema.omit({
  role: true,
}).extend({
  role: z.object(
    {
      label: z.string(),
      value: z.nativeEnum(EmployeeRole, {
        required_error: 'Employee.Role.Required',
      }),
    },
    {
      required_error: 'Employee.Role.Required',
      invalid_type_error: 'Employee.Role.Required',
    },
  ),
});

export type NewEmployeeFormValues = z.infer<typeof NewEmployeeFormSchema>;

export type NewEmployeeDto = z.infer<typeof NewEmployeeDtoSchema>;
