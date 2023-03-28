import { addDays } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { startSession, Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ExpirationController from 'api/controllers/Expiration.controller';
import ProductOrderController from 'api/controllers/ProductOrder.controller';
import connectToDB from 'api/database/databaseConnection';
import ProductModel from 'api/models/Product.model';
import type { IProduct } from 'api/models/Product.model/types';
import type { JSendResponse } from 'api/types/response.type';

export interface ImportProductRb {
  productId: string;
  supplierId: string;
  quantity: number;
  importDate: string;
  unitWholesalePrice: number;
}

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<IProduct>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  await connectToDB();

  const requestBody = req.body as ImportProductRb;

  const productId = new Types.ObjectId(requestBody.productId);
  const supplierId = new Types.ObjectId(requestBody.supplierId);
  const importDate = new Date(requestBody.importDate);

  const product = await ProductModel().findById(productId).exec();

  const productOrderInput = {
    product: productId,
    supplier: supplierId,
    importDate: importDate,
    quantity: requestBody.quantity,
    unitWholesalePrice: requestBody.unitWholesalePrice,
  };
  console.log(
    'file: import-product.ts:44 - productOrderInput:',
    productOrderInput,
  );

  const expirationInput = {
    product: new Types.ObjectId(requestBody.productId),
    importDate: importDate,
    expirationDate: addDays(importDate, product.shelfLife),
    quantity: requestBody.quantity,
  };
  console.log('file: import-product.ts:52 - expirationInput:', expirationInput);

  // FIXME generalize transaction handling (start session, start transaction, try/catch, abort/commit transaction, end session)
  const session = await startSession();
  session.startTransaction();

  try {
    await ProductOrderController.createOne(productOrderInput, session);
    const expiration = await ExpirationController.createOne(
      expirationInput,
      session,
    );

    product.defaultSupplier = supplierId;

    // manually add reference, can't do this in middleware because of transaction
    product.expirations.push(new Types.ObjectId(expiration.id));
    await product.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: product.toObject(),
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.log('X. ERROR OCCURRED');
    console.log(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message,
    });
  }
});

export default handler;
