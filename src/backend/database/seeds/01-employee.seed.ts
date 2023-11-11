import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { EmployeeEntity } from 'backend/entities/employee.entity';
import { EmployeeRole } from 'backend/enums/entities.enum';
import type { EmployeeModel } from 'models/employee.model';

const employeeSeeds: Omit<
  EmployeeModel,
  'account' | 'reviewResponses' | 'createdAt'
>[] = [
  {
    id: 'e18e7d23-55bd-48b0-b2fd-64ca6932df27',
    firstName: 'Tú',
    lastName: 'Nguyễn Ngọc Minh',
    email: 'admin@gmail.com',
    phone: '0342387906',
    birthday: new Date('2000-09-13'),
    personalId: '079200011633',
    role: EmployeeRole.MANAGER,
  },
  {
    id: 'a5a42bd9-f8c8-5af5-a371-75c30867736c',
    firstName: 'Trang',
    lastName: 'Nguyễn Thị Thùy',
    email: 'warehouse_manager@gmail.com',
    phone: '0342618906',
    birthday: new Date('2000-09-14'),
    personalId: '079200011634',
    role: EmployeeRole.WAREHOUSE_MANAGER,
  },
  {
    id: '64558cb0-5c20-56f0-b2bd-2af67c030779',
    firstName: 'Minh',
    lastName: 'Lê Quang',
    email: 'cashier@gmail.com',
    phone: '0342961971',
    birthday: new Date('2000-09-15'),
    personalId: '079200011635',
    role: EmployeeRole.CASHIER,
  },
  {
    id: '049162b6-7571-53de-8039-6bb4f3bfc172',
    firstName: 'Bảo',
    lastName: 'Trần Hoàng',
    email: 'shipper@gmail.com',
    phone: '0342387169',
    birthday: new Date('2000-09-16'),
    personalId: '079200011636',
    role: EmployeeRole.SHIPPER,
  },
  {
    id: '621a0d4a-1308-5d43-b669-b320a17c6876',
    firstName: 'Ngân',
    lastName: 'Võ Thị Kim',
    email: 'warehouse_staff@gmail.com',
    phone: '0342387174',
    birthday: new Date('2000-09-17'),
    personalId: '079200011637',
    role: EmployeeRole.WAREHOUSE_STAFF,
  },
];

export default class createEmployees implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const employeeRepo = connection.getRepository(EmployeeEntity);
    const res = employeeRepo.create(employeeSeeds);
    await employeeRepo.save(res);
  }
}
