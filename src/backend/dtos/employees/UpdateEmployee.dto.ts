import type { z } from 'zod';

import { NewEmployeeDtoSchema, NewEmployeeFormSchema } from './NewEmployee.dto';

export const UpdateEmployeeDtoSchema = NewEmployeeDtoSchema;

export const UpdateEmployeeFormSchema = NewEmployeeFormSchema;

export type UpdateEmployeeFormValues = z.infer<typeof UpdateEmployeeFormSchema>;
export type UpdateEmployeeDto = z.infer<typeof UpdateEmployeeDtoSchema>;
