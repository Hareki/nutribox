import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { EmployeeEntity } from 'backend/entities/employee.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { getRepo } from 'backend/utils/database.helper';

const handler = nc<NextApiRequest, NextApiResponse>(DEFAULT_NC_CONFIGS);

export default handler.post(async (req, res) => {
  const employeeRepo = await getRepo(EmployeeEntity);
  const employees = await employeeRepo.find();
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      data: employees,
      body: req.body,
    },
  });
});
