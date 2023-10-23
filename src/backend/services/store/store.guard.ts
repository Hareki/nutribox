import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

import type { UpdateStoreWorkTimesDto } from 'backend/dtos/store/updateStoreWorkTimes.dto';
import type { DayOfWeek } from 'backend/enums/entities.enum';

export const createUniqueDaysOfWeekGuard =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const dto = req.body as UpdateStoreWorkTimesDto;

    if (dto.length !== 7) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        data: {
          dayOfWeek: 'Must have exactly 7 items',
        },
      });
    }

    const daysSet = new Set<DayOfWeek>();
    for (const item of dto) {
      if (daysSet.has(item.dayOfWeek)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          data: {
            dayOfWeek: 'Days of week must be unique',
          },
        });
      }
      daysSet.add(item.dayOfWeek);
    }

    return next();
  };
