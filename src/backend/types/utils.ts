export type SharedProperties<T, U> = {
  [K in keyof T & keyof U]: T[K] | U[K];
};
