import { hash } from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => {
  return hash(password, SALT_ROUNDS);
};
