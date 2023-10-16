import { EntityNotFoundError } from 'typeorm';

export const extractDuplicateColumnName = (error: any): string => {
  const { detail } = error;
  const columnName = (detail as string).match(/Key \((.*?)\)=/)?.[1];
  return columnName || '';
};

// TypeORM errors
export const isDuplicateError = (error: any): boolean => {
  const { message } = error;
  return (message as string).includes('duplicate key value');
};

export const isEntityNotFoundError = (error: any): boolean => {
  return error instanceof EntityNotFoundError;
};
