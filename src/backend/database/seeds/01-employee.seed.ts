import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { EmployeeEntity } from 'backend/entities/employee.entity';
import { EmployeeRole } from 'backend/enums/Entities.enum';

const employeeSeeds: Omit<
  EmployeeEntity,
  'account' | 'reviewResponses' | 'createdAt'
>[] = [
  {
    id: 'e18e7d23-55bd-48b0-b2fd-64ca6932df27',
    firstName: 'Tú',
    lastName: 'Nguyễn Ngọc Minh',
    email: 'MinhTu@gmail.com',
    phone: '034238790',
    birthday: new Date('2000-01-01'),
    personalId: '0123456789',
    role: EmployeeRole.MANAGER,
  },
  {
    id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    firstName: 'Phúc',
    lastName: 'Trần Minh',
    email: 'MinhPhuc@gmail.com',
    phone: '0123456789',
    birthday: new Date('2000-01-01'),
    personalId: '0112233445',
    role: EmployeeRole.CASHIER,
  },
];

export default class createEmployees implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const employeeRepo = connection.getRepository(EmployeeEntity);
    await employeeRepo.save(employeeSeeds);
  }
}
