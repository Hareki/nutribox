import { omit } from 'lodash';
import { MoreThan } from 'typeorm';

import { CommonService } from '../common/common.service';

import type { CredentialsIdentifier } from './helper';

import type { ChangePasswordDto } from 'backend/dtos/password/changePassword.dto';
import type { SignUpDto } from 'backend/dtos/signUp.dto';
import { AccountEntity } from 'backend/entities/account.entity';
import { CustomerEntity } from 'backend/entities/customer.entity';
import { hashPassword } from 'backend/helpers/auth.helper';
import { getRepo } from 'backend/helpers/database.helper';
import {
  isDuplicateError,
  isEntityNotFoundError,
} from 'backend/helpers/validation.helper';
import type { AccountWithPopulatedSide, UserType } from 'backend/types/auth';
import { BadRequestError, DuplicationError } from 'backend/types/errors/common';
import type {
  FullyPopulatedAccountModel,
  PopulateAccountFields,
} from 'models/account.model';
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
      if (isDuplicateError(error)) {
        throw new DuplicationError('email', 'Account.Email.Duplicate');
      }
      throw error;
    }
  }

  public static async verifyEmail(
    token: string,
  ): Promise<FullyPopulatedAccountModel> {
    const accountRepo = await getRepo(AccountEntity);

    try {
      const account = await CommonService.getRecord({
        entity: AccountEntity,
        filter: {
          verificationToken: token,
          verificationTokenExpiry: MoreThan(new Date()),
        },
        relations: ['customer', 'employee'],
      });

      // `undefined` doesn't erase the value, `null` does. But we can't declare null type for entities due to some conflict
      // Example: Data type "Object" in "AccountEntity.verificationToken" is not supported by "postgres" database.
      // => Have to bypass the type check
      account.verificationToken = null as any;
      account.verificationTokenExpiry = null as any;
      account.verified = true;

      await accountRepo.save(account);

      return {
        ...account,
        password: '',
      } as FullyPopulatedAccountModel;
    } catch (error) {
      if (isEntityNotFoundError(error)) {
        throw new BadRequestError(
          'verificationToken',
          'Account.VerificationToken.Invalid',
        );
      }
      throw error;
    }
  }

  public static async resetPassword(
    token: string,
    password: string,
  ): Promise<FullyPopulatedAccountModel> {
    const accountRepo = await getRepo(AccountEntity);

    const account = await CommonService.getRecord({
      entity: AccountEntity,
      filter: {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: MoreThan(new Date()),
      },
      relations: ['customer', 'employee'],
    });

    // `undefined` doesn't erase the value, `null` does. But we can't declare null type for entities due to some conflict
    // Example: Data type "Object" in "AccountEntity.verificationToken" is not supported by "postgres" database.
    // => Have to bypass the type check
    account.password = hashPassword(password);
    account.forgotPasswordToken = null as any;
    account.forgotPasswordTokenExpiry = null as any;

    await accountRepo.save(account);

    return {
      ...account,
      password: '',
    } as FullyPopulatedAccountModel;
  }

  public static async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<PopulateAccountFields<'customer' | 'employee'>> {
    const oldHashedPassword = hashPassword(dto.oldPassword);

    try {
      await CommonService.getRecord({
        entity: AccountEntity,
        filter: {
          id,
          password: oldHashedPassword,
        },
      });

      await CommonService.updateRecord(AccountEntity, id, {
        password: hashPassword(dto.newPassword),
      });

      const populatedAccount = (await CommonService.getRecord({
        entity: AccountEntity,
        filter: { id },
        relations: ['customer', 'employee'],
      })) as PopulateAccountFields<'customer' | 'employee'>;

      return {
        ...populatedAccount,
        password: '',
      };
    } catch (error) {
      if (isEntityNotFoundError(error)) {
        throw new BadRequestError('oldPassword', 'Account.OldPassword.Invalid');
      }
      throw error;
    }
  }
}
