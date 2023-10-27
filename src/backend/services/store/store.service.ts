import { CommonService } from '../common/common.service';

import type { UpdateStoreInfoDto } from 'backend/dtos/store/updateStoreInfo.dto';
import type { UpdateStoreWorkTimesDto } from 'backend/dtos/store/updateStoreWorkTimes.dto';
import { StoreEntity } from 'backend/entities/store.entity';
import { StoreWorkTimeEntity } from 'backend/entities/storeWorkTime.entity';
import { getRepo } from 'backend/helpers/database.helper';
import { isEntityNotFoundError } from 'backend/helpers/validation.helper';
import { BadRequestError } from 'backend/types/errors/common';
import { STORE_ID } from 'constants/temp.constant';
import type { PopulateStoreFields, StoreModel } from 'models/store.model';

export class StoreService {
  public static async getStoreInfoAndWorkTimes(
    id = STORE_ID,
  ): Promise<PopulateStoreFields<'storeWorkTimes'>> {
    const store = (await CommonService.getRecord({
      entity: StoreEntity,
      relations: ['storeWorkTimes'],
      filter: { id },
    })) as PopulateStoreFields<'storeWorkTimes'>;

    return store;
  }

  public static async updateStoreInfo(
    id = STORE_ID,
    dto: UpdateStoreInfoDto,
  ): Promise<StoreModel> {
    try {
      const result = await CommonService.updateRecord(StoreEntity, id, dto);
      return result as StoreModel;
    } catch (error) {
      if (isEntityNotFoundError(error)) {
        throw new BadRequestError('id', 'Store id not found');
      }
      throw error;
    }
  }

  public static async updateStoreWorkTimes(
    id = STORE_ID,
    dto: UpdateStoreWorkTimesDto,
  ): Promise<PopulateStoreFields<'storeWorkTimes'>> {
    try {
      // Ensure that the store exists
      const storeCheck = await CommonService.getRecord({
        entity: StoreEntity,
        filter: { id },
      });

      const workTimeRepository = await getRepo(StoreWorkTimeEntity);
      await workTimeRepository.delete({ store: id });

      const newWorkTimes = dto.map((workTime) => {
        const newWorkTime = new StoreWorkTimeEntity();
        newWorkTime.dayOfWeek = workTime.dayOfWeek;

        // open time and close time are already in UTC because of the model transform. Don't touch them anymore or you'll get a wrong time
        const finalOpenTime = new Date(
          Date.UTC(
            1970,
            0,
            1,
            workTime.openTime.getHours(),
            workTime.openTime.getMinutes(),
            workTime.openTime.getSeconds(),
          ),
        );

        newWorkTime.openTime = finalOpenTime;

        const finalCloseTime = new Date(
          Date.UTC(
            1970,
            0,
            1,
            workTime.closeTime.getHours(),
            workTime.closeTime.getMinutes(),
            workTime.closeTime.getSeconds(),
          ),
        );

        newWorkTime.closeTime = finalCloseTime;
        newWorkTime.store = storeCheck;
        return newWorkTime;
      });

      await workTimeRepository.save(newWorkTimes);

      const store = (await CommonService.getRecord({
        entity: StoreEntity,
        filter: { id },
        relations: ['storeWorkTimes'],
      })) as PopulateStoreFields<'storeWorkTimes'>;

      return store;
    } catch (error) {
      if (isEntityNotFoundError(error)) {
        throw new BadRequestError('id', 'Store id not found');
      }
      throw error;
    }
  }
}
