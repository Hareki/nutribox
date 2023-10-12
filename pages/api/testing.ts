import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CommonService } from 'backend/services/common/common.service';

const handler = nc<NextApiRequest, NextApiResponse>(DEFAULT_NC_CONFIGS);

export default handler.post(async (req, res) => {
  // const employeeRepo = await getRepo(EmployeeEntity);
  // const employees = await employeeRepo.find();

  const { email, password } = req.body;

  // const employee = await AccountService.checkCredentials(
  //   { email },
  //   password,
  //   'employee',
  // );

  const account = await CommonService.getRecord({
    entity: CustomerOrderEntity,
    filter: {
      id: 'b2d4148b-064d-4262-8ed1-0d13fd3d4b03',
    },
    // relations: ['customer', 'employee'],
  });
  console.log('file: testing.ts:30 - handler.post - account:', account);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      data: account,
      body: req.body,
    },
  });
});
