import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';

// TypeORM-Seeding has some problems with this import, so we have to use leave the import into a separate file
import { authOptions } from '../../../pages/api/auth/[...nextauth]';

export const getSessionAccount = async (
  req: NextApiRequest,
  res: NextApiResponse,
  accountType: 'account' | 'employeeAccount' = 'account',
) => ((await getServerSession(req, res, authOptions)) as Session)[accountType];
