import crypto from 'crypto-js';

export const generateToken = (): string =>
  crypto.lib.WordArray.random(20).toString(crypto.enc.Hex);
