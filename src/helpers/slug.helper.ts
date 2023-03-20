export function extractIdFromSlug(slug: string) {
  const parts = slug.split('-');
  const id = parts[parts.length - 1];
  return id;
}
