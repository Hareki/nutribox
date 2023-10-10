import type { CredentialsIdentifier } from './types';

import { AccountEntity } from 'backend/entities/account.entity';
import type { AccountWithPopulatedSide, UserType } from 'backend/types/auth';
import { hashPassword } from 'backend/utils/auth.helper';
import { getRepo } from 'backend/utils/database.helper';
import type { FullyPopulatedAccountModel } from 'models/account.model';

export class AccountService {
  public static async checkCredentials<U extends UserType>(
    identifier: CredentialsIdentifier,
    password: string,
    userSide: U,
  ): Promise<AccountWithPopulatedSide<U> | null> {
    const accountRepo = await getRepo(AccountEntity);

    const { email, id } = identifier;
    const hashedPassword = hashPassword(password);

    let identifierFilter: typeof identifier | undefined = undefined;
    if (email) identifierFilter = { email: email.toLowerCase() };
    if (id) identifierFilter = { id };

    if (!identifierFilter) return null;

    const account = (await accountRepo
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .andWhere('user.password = :hashedPassword', { hashedPassword })
      .leftJoinAndSelect('user.customer', 'customer') // populating customer relation
      .leftJoinAndSelect('user.employee', 'employee') // populating employee relation
      .getOne()) as FullyPopulatedAccountModel;

    const isCustomer = userSide === 'customer' && account?.customer;
    const isEmployee = userSide === 'employee' && account?.employee;

    if (isCustomer || isEmployee) {
      return account;
    }
    return null;
  }
}
