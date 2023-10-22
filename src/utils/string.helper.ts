import pluralize from 'pluralize';
import { snakeCase } from 'typeorm/util/StringUtils';

import { CustomerAddressType } from 'backend/enums/entities.enum';

export const serialize = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

export const toTableName = (str: string): string => {
  // Convert from camelCase to snake_case
  let snake = snakeCase(str);

  // Convert from plural to singular
  snake = pluralize.singular(snake);

  return snake;
};

export const snakeCaseToCamelCase = (str: string) => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
};

export const objKeysFromSnakeCaseToCamelCase = <T extends Record<string, any>>(
  obj: T,
) => {
  const newObj = {} as T;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = snakeCaseToCamelCase(key) as keyof T;
      newObj[newKey] = obj[key];
    }
  }

  return newObj;
};

export const removeAccents = (vnStr: string): string => {
  return vnStr
    .replace(/,/g, '')
    .replace(/\./g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

type GetSlugInput = { name: string; id: string };
export const getSlug = (input?: GetSlugInput) => {
  if (!input) return '';
  const { name, id } = input;
  const transformedName = name.trim().toLowerCase().replace(/\s+/g, '-');
  return removeAccents(transformedName) + '_' + id;
};

// export const getAddressTypeLabel = (type: CustomerAddressType) => {
//   switch (type) {
//     case CustomerAddressType.HOME:
//       return 'Nhà riêng';
//     case CustomerAddressType.OFFICE:
//       return 'Cơ quan';
//     default:
//       return '';
//   }
// };
