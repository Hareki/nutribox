import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getAllProducts } from 'api/base/pre-render';
import connectToDB from 'api/database/databaseConnection';
import type { IProduct } from 'api/models/Product.model/types';
import type {
  GetPaginationPrerenderResult,
  GetPaginationResult,
} from 'api/types/pagination.type';

type UnionPagination =
  | GetPaginationResult<IProduct>
  | GetPaginationPrerenderResult<IProduct>;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      console.log('new handler');
      await connectToDB();

      const { populate, docsPerPage, page } = req.query;
      const isPopulate = populate === 'true';

      const result = await getAllProducts(
        docsPerPage as string,
        page as string,
        isPopulate,
      );

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: result,
      });
      break;
    }

    default: {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errorMessage: 'Method not supported' });
    }
  }
}

export default handler;
