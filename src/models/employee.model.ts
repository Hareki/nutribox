import { z } from 'zod';

import type { AccountModel } from './account.model';
import { zodDate, zodString, zodUuid } from './helper';
import type { ReviewResponseModel } from './reviewResponse.model';

import { EmployeeRole } from 'backend/enums/Entities.enum';
import { NAME_REGEX, PHONE_REGEX, PID_REGEX } from 'constants/regex.constant';

const EmployeeSchema = z.object({
  id: zodUuid('Employee.Id'),

  personalId: zodString('Employee.PersonalId').regex(PID_REGEX, {
    message: 'Employee.PersonalId.InvalidFormat',
  }),

  role: z.nativeEnum(EmployeeRole, {
    required_error: 'Employee.Role.Required',
  }),

  account: zodUuid('Employee.AccountId').optional(),

  firstName: zodString('Employee.FirstName', 1, 50).regex(NAME_REGEX, {
    message: 'Employee.FirstName.InvalidFormat',
  }),

  lastName: zodString('Employee.LastName', 1, 50).regex(NAME_REGEX, {
    message: 'Employee.LastName.InvalidFormat',
  }),

  email: zodString('Employee.Email').email({
    message: 'Employee.Email.InvalidFormat',
  }),

  phone: zodString('Employee.Phone').regex(PHONE_REGEX, {
    message: 'Employee.Phone.InvalidFormat',
  }),

  birthday: zodDate('Employee.Birthday'),

  reviewResponses: z.array(z.string().uuid()).optional(),
});

type EmployeeModel = z.infer<typeof EmployeeSchema>;

type EmployeeReferenceKeys = keyof Pick<
  EmployeeModel,
  'account' | 'reviewResponses'
>;

type PopulateField<K extends keyof EmployeeModel> = K extends 'account'
  ? AccountModel
  : K extends 'reviewResponses'
  ? ReviewResponseModel[]
  : never;

type PopulateEmployeeFields<K extends EmployeeReferenceKeys> = Omit<
  EmployeeModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedEmployeeModel =
  PopulateEmployeeFields<EmployeeReferenceKeys>;

export { EmployeeSchema };
export type {
  EmployeeModel,
  FullyPopulatedEmployeeModel,
  PopulateEmployeeFields,
};