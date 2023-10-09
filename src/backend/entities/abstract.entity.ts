import { CreateDateColumn } from 'typeorm';

export abstract class AbstractEntity {
  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt: Date;
}
