import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';
import { z } from 'zod';

export const createSchemaValidationMiddleware =
  (schema: z.ZodSchema<Record<string, any>>) =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(JSON.stringify(error));
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          data: error.issues.reduce((acc, current) => {
            acc[current.path.join('.')] = current.message;
            return acc;
          }, {}),
        });
      } else {
        console.log('========== UNEXPECTED VALIDATION ERROR ==========');
        console.log(error);
        console.log('=================================================');

        res.status(500).json({
          status: 'error',
          message: 'An unexpected error occurred',
        });
      }
    }
  };
