import crypto from 'crypto-js';
import type { ValueTransformer } from 'typeorm';

export class StringEncryptionTransformer implements ValueTransformer {
  private static readonly IV = crypto.enc.Hex.parse(process.env.CRYPTOJS_IV!); // Example IV

  // Upon insertion.
  to(value: string | null): string | null {
    if (value === null) return null;

    const secretKey = crypto.enc.Utf8.parse(process.env.CRYPTOJS_SECRET!);
    const encrypted = crypto.AES.encrypt(value, secretKey, {
      iv: StringEncryptionTransformer.IV,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  // Upon extraction.
  from(value: string | null): string | null {
    if (value === null) return null;

    const secretKey = crypto.enc.Utf8.parse(process.env.CRYPTOJS_SECRET!);
    const decrypted = crypto.AES.decrypt(value, secretKey, {
      iv: StringEncryptionTransformer.IV,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });
    return decrypted.toString(crypto.enc.Utf8);
  }
}

export class DateEncryptionTransformer implements ValueTransformer {
  // Upon insertion.
  to(value: Date | null): string | null {
    if (value === null) return null;
    const secretKey = process.env.CRYPTOJS_SECRET!;
    // Convert Date object to string (ISO format)
    const dateStr = value.toISOString();
    // Encrypt the serialized date
    return crypto.AES.encrypt(dateStr, secretKey).toString();
  }

  // Upon extraction.
  from(value: string | null): Date | null {
    if (value === null) return null;
    const secretKey = process.env.CRYPTOJS_SECRET!;
    // Decrypt the encrypted string
    const decryptedStr = crypto.AES.decrypt(value, secretKey).toString(
      crypto.enc.Utf8,
    );
    // Convert string back to Date object
    return new Date(decryptedStr);
  }
}
