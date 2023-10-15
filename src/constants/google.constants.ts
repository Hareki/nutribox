import { createClient } from '@google/maps';

export const GOOGLE_MAPS_CLIENT = createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise,
});
