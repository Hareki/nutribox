import type { IExpiration } from 'api/models/Expiration.model/types';

export function extractIdFromSlug(slug: string) {
  const parts = slug.split('-');
  const id = parts[parts.length - 1];
  return id;
}

export function getMaxUpeQuantity(expirations: IExpiration[]) {
  const result = expirations.reduce((max, expiration) => {
    max += expiration.quantity;
    return max;
  }, 0);

  return result;
}
