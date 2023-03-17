import type mongoose from 'mongoose';

// When there're more than one duplicate key error, the error object will be the first duplicate one
export interface DuplicateKeyError {
  index: number;
  code: 11000 | 11001;
  keyPattern: Record<string, number>;
  keyValue: Record<string, unknown>;
}

export interface ValidationError extends mongoose.Error.ValidationError {}
// Example of ValidationError:
// {
//   "errors": {
//     "firstName": {
//       "name": "ValidatorError",
//       "message": "Account/FirstName is required",
//       "properties": {
//         "message": "Account/FirstName is required",
//         "type": "required",
//         "path": "firstName",
//         "value": ""
//       },
//       "kind": "required",
//       "path": "firstName",
//       "value": ""
//     },
//     "phone": {
//       "name": "ValidatorError",
//       "message": "Invalid Account/Phone format",
//       "properties": {
//         "message": "Invalid Account/Phone format",
//         "type": "user defined",
//         "path": "phone",
//         "value": "033-875-800"
//       },
//       "kind": "user defined",
//       "path": "phone",
//       "value": "033-875-800"
//     }
//   },
//   "_message": "Account validation failed",
//   "name": "ValidationError",
//   "message": "Account validation failed: firstName: Account/FirstName is required, phone: Invalid Account/Phone format"
// }

export function instanceOfDuplicateKeyError(
  object: any,
): object is DuplicateKeyError {
  return 'index' in object && 'code' in object && 'keyPattern' in object;
}

export function instanceOfValidationError(
  object: any,
): object is ValidationError {
  return 'errors' in object && 'name' in object && 'message' in object;
}
