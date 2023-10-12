export type SharedProperties<T, U> = {
  [K in keyof T & keyof U]: T[K] | U[K];
};

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type MethodRoutePair = {
  methods: RequestMethod[];
  route: string;
};
