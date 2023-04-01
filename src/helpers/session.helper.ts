import type { ParsedUrlQuery } from 'querystring';

import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../pages/api/auth/[...nextauth]';

export const reloadSession = () => {
  const event = new Event('visibilitychange');
  document.dispatchEvent(event);
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
