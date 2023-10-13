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
