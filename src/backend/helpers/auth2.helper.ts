import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';

// TypeORM-Seeding has some problems with this import, so we have to use leave the import into a separate file
import { authOptions } from '../../../pages/api/auth/[...nextauth]';

export const getSessionCustomerAccount = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => ((await getServerSession(req, res, authOptions)) as Session).account;

export const getSessionEmployeeAccount = async (
  req: NextApiRequest,
  res: NextApiResponse,
) =>
  ((await getServerSession(req, res, authOptions)) as Session).employeeAccount;
