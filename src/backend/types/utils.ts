export type SharedProperties<T, U> = {
  [K in keyof T & keyof U]: T[K] | U[K];
};

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type MethodRoutePair = {
  methods: RequestMethod[];
  route: string;
};

export type CustomerPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
export type CustomerRequired<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>;
