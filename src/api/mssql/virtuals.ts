import bcrypt from 'bcryptjs';

import { getSlug } from 'api/helpers/slug.helper';

export const virtuals = {
  getSlug: getSlug,
  getFullName: (lastName: string, firstName: string) =>
    `${lastName} ${firstName}`,
  isPasswordMatch: (candidatePassword: string, userPassword: string) =>
    bcrypt.compare(candidatePassword, userPassword),
};
