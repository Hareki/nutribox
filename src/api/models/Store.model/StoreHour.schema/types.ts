export interface IStoreHour {
  // _id: Types.ObjectId;
  id: string;

  dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';
  openTime: string;
  closeTime: string;
}

export interface IStoreHourInput
  extends Omit<IStoreHour, '_id' | 'id' | 'openTime' | 'closeTime'> {
  openTime: Date;
  closeTime: Date;
}
