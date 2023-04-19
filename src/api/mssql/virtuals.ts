import bcrypt from 'bcryptjs';

import { getSlug } from 'api/helpers/slug.helper';
import { getAvatarUrl } from 'helpers/account.helper';

export const virtuals = {
  getSlug: getSlug,
  getFullName: (lastName: string, firstName: string) =>
    `${lastName} ${firstName}`,
  isPasswordMatch: (candidatePassword: string, userPassword: string) =>
    bcrypt.compare(candidatePassword, userPassword),
  getAvatarUrl: getAvatarUrl,
};
