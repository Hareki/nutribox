import type { z } from 'zod';

import { EmployeeSchema } from 'models/employee.model';

export const UpdateStaffProfileDtoSchema = EmployeeSchema.pick({
  firstName: true,
  lastName: true,
  birthday: true,
  phone: true,
  personalId: true,
}).required();
export type UpdateStaffProfileDto = z.infer<typeof UpdateStaffProfileDtoSchema>;
export type UpdateStaffProfileFormValues = UpdateStaffProfileDto & {
  email?: string;
};

export const UpdateStaffProfileAvatarDtoSchema = EmployeeSchema.pick({
  avatarUrl: true,
}).required();
export type UpdateStaffProfileAvatarDto = z.infer<
  typeof UpdateStaffProfileAvatarDtoSchema
>;
