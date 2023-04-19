import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { poolPromise } from 'api/database/mssql.config';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM store_hours');
    console.log('result', result);
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    console.error('Error connecting to the database:', err);
    res.status(StatusCodes.OK).json({
      status: 'error',
      data: 'failed to connect',
    });
  }
});

export default handler;
