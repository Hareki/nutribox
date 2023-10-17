import { CommonService } from '../common/common.service';

import { StoreEntity } from 'backend/entities/store.entity';
import { STORE_ID } from 'constants/temp.constant';
import type { PopulateStoreFields } from 'models/store.model';

export class StoreService {
  public static async getStoreInfo(
    id = STORE_ID,
  ): Promise<PopulateStoreFields<'storeWorkTimes'>> {
    const store = (await CommonService.getRecord({
      entity: StoreEntity,
      relations: ['storeWorkTimes'],
      filter: { id },
    })) as PopulateStoreFields<'storeWorkTimes'>;

    return store;
  }
}
