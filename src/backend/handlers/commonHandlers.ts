import { DuplicationError } from 'backend/types/errors/common';
import {
  extractDuplicateColumnName,
  isDuplicateError,
} from 'backend/helpers/validation.helper';

export const handleTypeOrmError = (error: any) => {
  if (isDuplicateError(error)) {
    throw new DuplicationError(
      error.message,
      extractDuplicateColumnName(error),
    );
  }
  throw error;
};
