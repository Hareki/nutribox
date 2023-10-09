import crypto from 'crypto-js';

export function hashPassword(password: string): string {
  const secret = process.env.CRYPTOJS_SECRET;
  if (secret) {
    const hash = crypto.HmacSHA256(password, secret);
    return crypto.enc.Base64.stringify(hash);
  }
  throw new Error('process.env.CRYPTOJS_SECRET is not defined');
}

export function comparePassword(
  password: string,
  hashedPassword: string,
): boolean {
  const hashedInputPassword = hashPassword(password);
  return hashedInputPassword === hashedPassword;
}
