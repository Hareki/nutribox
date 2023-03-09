export const removeAccents = (vnStr: string): string => {
  return vnStr
    .replace(/,/g, '')
    .replace(/\./g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export const getSlug = (name: string) => {
  const transformedName = name.trim().toLowerCase().replace(/\s+/g, '-');
  return removeAccents(transformedName);
};
