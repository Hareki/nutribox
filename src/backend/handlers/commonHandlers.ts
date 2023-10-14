import {
  DuplicationError,
  EntityNotFoundError,
} from 'backend/types/errors/common';
import {
  extractDuplicateColumnName,
  isDuplicateError,
  isEntityNotFoundError,
} from 'backend/utils/validation.helper';

export const handleTypeOrmError = (error: any) => {
  if (isDuplicateError(error)) {
    throw new DuplicationError(
      error.message,
      extractDuplicateColumnName(error),
    );
  } else if (isEntityNotFoundError(error)) {
    throw new EntityNotFoundError(error.message);
  }
  throw error;
};
