import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import StoreModel from 'api/models/Store.model';
import type { IStoreHourInput } from 'api/models/Store.model/StoreHour.schema/types';
import type { IStoreInput } from 'api/models/Store.model/types';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const dataArray: IStoreHourInput[] = [
    {
      dayOfWeek: 'MONDAY',
      openTime: new Date('1970-01-01T08:00:00.000Z'),
      closeTime: new Date('2021-01-01T18:00:00.000Z'),
    },
    {
      dayOfWeek: 'TUESDAY',
      openTime: new Date('1970-01-01T08:00:00.000Z'),
      closeTime: new Date('2021-01-01T18:00:00.000Z'),
    },
    {
      dayOfWeek: 'WEDNESDAY',
      openTime: new Date('1970-01-01T08:00:00.000Z'),
      closeTime: new Date('2021-01-01T18:00:00.000Z'),
    },
    {
      dayOfWeek: 'THURSDAY',
      openTime: new Date('1970-01-01T08:00:00.000Z'),
      closeTime: new Date('2021-01-01T18:00:00.000Z'),
    },
    {
      dayOfWeek: 'FRIDAY',
      openTime: new Date('1970-01-01T07:00:00.000Z'),
      closeTime: new Date('2021-01-01T20:00:00.000Z'),
    },
    {
      dayOfWeek: 'SATURDAY',
      openTime: new Date('1970-01-01T07:00:00.000Z'),
      closeTime: new Date('2021-01-01T20:00:00.000Z'),
    },
    {
      dayOfWeek: 'SUNDAY',
      openTime: new Date('1970-01-01T07:00:00.000Z'),
      closeTime: new Date('2021-01-01T20:00:00.000Z'),
    },
  ];

  const mainData: IStoreInput = {
    phone: '033-875-8008',
    email: 'n18dccn192@student.ptithcm.edu.vn',
    province: 'Thành phố Hồ Chí Minh',
    provinceId: 79,
    district: 'Quận Bình Thạnh',
    districtId: 765,
    ward: 'Phường 22',
    wardId: 26956,
    streetAddress: '208 Nguyễn Hữu Cảnh',
    storeHours: dataArray,
  };

  await StoreModel().create(mainData);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: 'done',
  });
});

export default handler;
