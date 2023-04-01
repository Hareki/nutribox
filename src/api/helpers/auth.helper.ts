import type { ParsedUrlQuery } from 'querystring';

import { hash } from 'bcryptjs';
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../pages/api/auth/[...nextauth]';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => {
  return hash(password, SALT_ROUNDS);
};

export const checkContextCredentials = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  let blockingResult: GetServerSidePropsResult<any> = null;

  if (!session) {
    blockingResult = {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (context.req.url.startsWith('/admin')) {
    const isAdmin = session?.user?.role === 'ADMIN';

    if (!isAdmin) {
      blockingResult = {
        notFound: true,
      };
    }
  }

  const isNotAuthorized = blockingResult !== null;

  return { session, blockingResult, isNotAuthorized };
};
