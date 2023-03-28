import { addDays } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import ExpirationModel from 'api/models/Expiration.model';
import type { IExpirationInput } from 'api/models/Expiration.model/types';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  // const dataArray: IProductOrderInput[] = [
  //   {
  //     product: new Types.ObjectId('640990a80009112a7a900b94'),
  //     quantity: 15,
  //     supplier: new Types.ObjectId('641e7ab71c9ba28cf0a164b3'),
  //     unitWholesalePrice: 12_000,
  //     importDate: new Date(),
  //   },
  //   {
  //     product: new Types.ObjectId('640990a80009112a7a900b94'),
  //     quantity: 15,
  //     supplier: new Types.ObjectId('641e7ab71c9ba28cf0a164b3'),
  //     unitWholesalePrice: 12_000,
  //     importDate: new Date(),
  //   },
  //   {
  //     product: new Types.ObjectId('640990a80009112a7a900b94'),
  //     quantity: 15,
  //     supplier: new Types.ObjectId('641e7ab71c9ba28cf0a164b5'),
  //     unitWholesalePrice: 12_000,
  //     importDate: new Date(),
  //   },
  //   {
  //     product: new Types.ObjectId('640990a80009112a7a900b94'),
  //     quantity: 15,
  //     supplier: new Types.ObjectId('641e7ab71c9ba28cf0a164b6'),
  //     unitWholesalePrice: 12_000,
  //     importDate: new Date(),
  //   },
  // ];
  // await ProductOrderModel().create(dataArray);

  const dataArray: IExpirationInput[] = [
    {
      product: new Types.ObjectId('640990a80009112a7a900b94'),
      quantity: 15,
      importDate: new Date('2023-03-28T07:24:07.407+00:00'),
      expirationDate: addDays(new Date('2023-03-28T07:24:07.407+00:00'), 15),
    },
    {
      product: new Types.ObjectId('640990a80009112a7a900b94'),
      quantity: 15,
      importDate: new Date('2023-03-28T07:24:07.407+00:00'),
      expirationDate: addDays(new Date('2023-03-28T07:24:07.407+00:00'), 15),
    },
    {
      product: new Types.ObjectId('640990a80009112a7a900b94'),
      quantity: 15,
      importDate: new Date('2023-03-28T07:24:07.407+00:00'),
      expirationDate: addDays(new Date('2023-03-28T07:24:07.407+00:00'), 15),
    },
    {
      product: new Types.ObjectId('640990a80009112a7a900b94'),
      quantity: 15,
      importDate: new Date('2023-03-28T07:24:07.407+00:00'),
      expirationDate: addDays(new Date('2023-03-28T07:24:07.407+00:00'), 15),
    },
  ];
  await ExpirationModel().create(dataArray);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: 'done',
  });
});

export default handler;
