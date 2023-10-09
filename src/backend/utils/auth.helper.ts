import crypto from 'crypto-js';

export function hashPassword(password: string): string {
  const hash = crypto.HmacSHA256(password, process.env.CRYPTOJS_SECRET);
  return crypto.enc.Base64.stringify(hash);
}

export function comparePassword(
  password: string,
  hashedPassword: string,
): boolean {
  const hashedInputPassword = hashPassword(password);
  return hashedInputPassword === hashedPassword;
}
