import type { Types } from 'mongoose';

import type { IExpiration } from 'api/models/Expiration.model/types';

export interface IConsumptionHistory {
  // _id: Types.ObjectId;
  id: string;
  expiration: Types.ObjectId;
  quantity: number;
}

export interface IPopulatedConsumptionHistory
  extends Omit<IConsumptionHistory, 'expiration'> {
  expiration: IExpiration;
}

export interface IConsumptionHistoryInput
  extends Omit<IConsumptionHistory, '_id' | 'id'> {}
