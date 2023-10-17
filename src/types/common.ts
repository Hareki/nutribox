import type { NextPage } from 'next';
import type { ReactNode } from 'react';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export type Id = {
  id: string;
};

export type GeneralFunction = (...args: any) => any;
