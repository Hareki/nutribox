import { DuplicationError } from 'backend/types/errors/common';
import {
  extractDuplicateColumnName,
  isDuplicateError,
} from 'backend/utils/validation.helper';

export const handleTypeOrmError = (error: any) => {
  if (isDuplicateError(error)) {
    throw new DuplicationError(
      error.message,
      extractDuplicateColumnName(error),
    );
  } else throw error;
};
