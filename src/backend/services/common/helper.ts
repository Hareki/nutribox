import type { AbstractEntity } from 'backend/entities/abstract.entity';
import type { GetRecordsInputs } from 'backend/types/service';

export type CommonArgs<T extends AbstractEntity> = Partial<
  GetRecordsInputs<T>
> & {
  entity: new (...args: any[]) => T;
};
