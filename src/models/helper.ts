export type RefinementParameters<T> = [
  (data: T) => boolean,
  { message: string; path: string[] },
];
