import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';

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

  // const dataArray: IExpirationInput[] = [
  //   {
  //     product: new Types.ObjectId('640990a80009112a7a900b94'),
  //     quantity: 15,
  //     importDate: new Date('2023-03-28T07:24:07.407+00:00'),
  //     expirationDate: addDays(new Date('2023-03-28T07:24:07.407+00:00'), 15),
  //   },
  //   {
  //     product: new Types.ObjectId('640990a80009112a7a900b94'),
  //     quantity: 15,
  //     importDate: new Date('2023-03-28T07:24:07.407+00:00'),
  //     expirationDate: addDays(new Date('2023-03-28T07:24:07.407+00:00'), 15),
  //   },
  //   {
  //     product: new Types.ObjectId('640990a80009112a7a900b94'),
  //     quantity: 15,
  //     importDate: new Date('2023-03-28T07:24:07.407+00:00'),
  //     expirationDate: addDays(new Date('2023-03-28T07:24:07.407+00:00'), 15),
  //   },
  //   {
  //     product: new Types.ObjectId('640990a80009112a7a900b94'),
  //     quantity: 15,
  //     importDate: new Date('2023-03-28T07:24:07.407+00:00'),
  //     expirationDate: addDays(new Date('2023-03-28T07:24:07.407+00:00'), 15),
  //   },
  // ];
  // await ExpirationModel().create(dataArray);

  // const imagekit = getImageKitInstance();

  // try {
  //   const result = await imagekit.listFiles({
  //     name: getImageNameFromUrl(
  //       'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-chua-bi-hop-300g/1.jpg',
  //     ),
  //     path: getImagePathFromUrl(
  //       'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-chua-bi-hop-300g/1.jpg',
  //     ),
  //     limit: 1,
  //   });
  //   // console.log('file: Product.controller.ts:208 - result:', result);

  //   console.log('HELLO??');
  //   console.log(
  //     getImageNameFromUrl(
  //       'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-chua-bi-hop-300g/1.jpg',
  //     ),
  //   );

  //   // if (result.length > 0) {
  //   //   const fileId = result[0].fileId;
  //   //   await deleteFileById(fileId);
  //   // }
  //   res.status(StatusCodes.OK).json({
  //     status: 'success',
  //     data: result,
  //   });

  //   return;
  // } catch (error) {
  //   console.log('Error:', error);
  // }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: 'done',
  });
});

export default handler;
