export interface IStoreHour {
  id: string;
  store_id: string;

  day_of_week:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';
  open_time: string;
  close_time: string;
}

export interface IStoreHourWithObjectId extends IStoreHour {}

export interface IStoreHourInput
  extends Omit<IStoreHour, 'id' | 'open_time' | 'close_time'> {
  open_time: Date;
  close_time: Date;
}
