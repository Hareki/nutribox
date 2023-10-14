import { omit } from 'lodash';
import { MoreThan } from 'typeorm';

import type { CredentialsIdentifier } from './helper';

import type { SignUpDto } from 'backend/dtos/sign-up.dto';
import { AccountEntity } from 'backend/entities/account.entity';
import { CustomerEntity } from 'backend/entities/customer.entity';
import { handleTypeOrmError } from 'backend/handlers/commonHandlers';
import type { AccountWithPopulatedSide, UserType } from 'backend/types/auth';
import { hashPassword } from 'backend/utils/auth.helper';
import { getRepo } from 'backend/utils/database.helper';
import type { FullyPopulatedAccountModel } from 'models/account.model';
import type { CustomerModel } from 'models/customer.model';
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
      .leftJoinAndSelect('user.customer', 'customer')
      .leftJoinAndSelect('user.employee', 'employee')
      .getOne()) as FullyPopulatedAccountModel;

    const isCustomer = userSide === 'customer' && account?.customer;
    const isEmployee = userSide === 'employee' && account?.employee;

    if (isCustomer || isEmployee) {
      return account;
    }
    return null;
  }

  public static async createCustomerAccount(
    dto: SignUpDto,
  ): Promise<AccountWithPopulatedSide<'customer'>> {
    const accountRepo = await getRepo(AccountEntity);
    const customerRepo = await getRepo(CustomerEntity);

    const hashedPassword = hashPassword(dto.password);

    try {
      const customer = (await customerRepo.save({
        ...omit(dto, ['password']),
      })) as CustomerModel;

      const account = await accountRepo.save({
        email: dto.email,
        password: hashedPassword,
        customer: {
          id: customer.id,
        },
      });

      return {
        ...account,
        customer,
        password: '',
      };
    } catch (error) {
      return handleTypeOrmError(error);
    }
  }

  public static async verifyCustomerEmail(
    token: string,
  ): Promise<AccountWithPopulatedSide<'customer'>> {
    const accountRepo = await getRepo(AccountEntity);

    try {
      const account = await accountRepo.findOneOrFail({
        where: {
          verificationToken: token,
          verificationTokenExpiry: MoreThan(new Date()),
        },
        relations: ['customer'],
      });

      // `undefined` doesn't erase the value, `null` does. But we can't declare null type for entities due to some conflict
      // Example: Data type "Object" in "AccountEntity.verificationToken" is not supported by "postgres" database.
      // => Have to bypass the type check
      account.verificationToken = null as any;
      account.verificationTokenExpiry = null as any;
      account.verified = true;

      await accountRepo.save(account);

      return account as AccountWithPopulatedSide<'customer'>;
    } catch (error) {
      return handleTypeOrmError(error);
    }
  }
}
