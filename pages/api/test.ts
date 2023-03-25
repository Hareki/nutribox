import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import SupplierModel from 'api/models/Supplier.model';
import type { ISupplierInput } from 'api/models/Supplier.model/types';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const dataArray: ISupplierInput[] = [
    {
      name: 'Supplier 1',
      phone: '033-875-8008',
      email: 'supplier1@gmail.com',

      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Tân Định',

      provinceId: 79,
      districtId: 760,
      wardId: 26734,

      streetAddress: '12/12 Đường 49',
    },
    {
      name: 'Supplier 2',
      phone: '033-831-1008',
      email: 'supplier2@gmail.com',

      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Đa Kao"',

      provinceId: 79,
      districtId: 760,
      wardId: 26737,

      streetAddress: '12/12 Đường 49',
    },
    {
      name: 'Supplier 3',
      phone: '033-835-8862',
      email: 'supplier3@gmail.com',

      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',

      provinceId: 79,
      districtId: 760,
      wardId: 26740,

      streetAddress: '12/12 Đường 49',
    },
    {
      name: 'Supplier 4',
      phone: '033-865-8008',
      email: 'supplier4@gmail.com',

      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Thành',

      provinceId: 79,
      districtId: 760,
      wardId: 26743,

      streetAddress: '12/12 Đường 49',
    },
    {
      name: 'Supplier 5',
      phone: '033-875-1238',
      email: 'supplier5@gmail.com',

      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Nguyễn Thái Bình',

      provinceId: 79,
      districtId: 760,
      wardId: 26746,

      streetAddress: '12/12 Đường 49',
    },
  ];

  await SupplierModel().insertMany(dataArray);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: 'done',
  });
});

export default handler;
