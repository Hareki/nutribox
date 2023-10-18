import { z } from 'zod';

import {
  AccountSchema,
  PasswordConfirmationSchema,
} from 'models/account.model';
import { CustomerSchema } from 'models/customer.model';

export const SignUpDtoSchema = AccountSchema.pick({
  email: true,
  password: true,
})
  .required()
  .and(
    CustomerSchema.pick({
      firstName: true,
      lastName: true,
      phone: true,
      birthday: true,
    }).required(),
  );

export const SignUpFormSchema = z.intersection(
  SignUpDtoSchema,
  PasswordConfirmationSchema,
);
export type SignUpDto = z.infer<typeof SignUpDtoSchema>;
export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;
