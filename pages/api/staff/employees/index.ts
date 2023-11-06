import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { NewEmployeeDto } from 'backend/dtos/employees/NewEmployee.dto';
import { NewEmployeeDtoSchema } from 'backend/dtos/employees/NewEmployee.dto';
import type { VerifyEmployeeEmailDto } from 'backend/dtos/verifyEmployeeEmail.dto';
import { VerifyEmployeeEmailDtoSchema } from 'backend/dtos/verifyEmployeeEmail.dto';
import { EmployeeEntity } from 'backend/entities/employee.entity';
import { EmployeeRole } from 'backend/enums/entities.enum';
import { getRepo } from 'backend/helpers/database.helper';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { AccountService } from 'backend/services/account/account.service';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonArgs } from 'backend/services/common/helper';
import type { CommonEmployeeModel } from 'backend/services/employee/helper';
import { MailerService } from 'backend/services/mailer/mailer.service';
import type { AccountWithPopulatedSide } from 'backend/types/auth';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import { DEFAULT_DOCS_PER_PAGE } from 'constants/pagination.constant';

type SuccessResponse = JSSuccess<
  CommonEmployeeModel[] | AccountWithPopulatedSide<'employee'>
>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const paginationParams = getPaginationParams(req);
    const keyword = req.query.keyword as string;

    const commonArgs: CommonArgs<EmployeeEntity> = {
      entity: EmployeeEntity,
      relations: ['account'],
    };

    if (keyword) {
      const employeeRepository = await getRepo(EmployeeEntity);
      const queryBuilder = employeeRepository.createQueryBuilder('employee');
      const nameParts = keyword.trim().split(/\s+/);
      nameParts.forEach((part, index) => {
        queryBuilder.orWhere(`employee.firstName ILIKE :part${index}`, {
          [`part${index}`]: `%${part}%`,
        });
        queryBuilder.orWhere(`employee.lastName ILIKE :part${index}`, {
          [`part${index}`]: `%${part}%`,
        });
      });

      queryBuilder.leftJoinAndSelect('employee.account', 'account');
      const employees = (await queryBuilder
        .take(DEFAULT_DOCS_PER_PAGE)
        .getMany()) as CommonEmployeeModel[];

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: employees,
      });
    } else {
      const [employees, totalRecords] = await CommonService.getRecords({
        ...commonArgs,
        paginationParams,
      });

      setPaginationHeader(res, {
        ...paginationParams,
        totalRecords,
      });

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: employees as CommonEmployeeModel[],
      });
    }
  })
  .post(createValidationGuard(NewEmployeeDtoSchema), async (req, res) => {
    try {
      const body = req.body as NewEmployeeDto;
      const data = await AccountService.createEmployeeAccount(body);
      if (body.role !== EmployeeRole.WAREHOUSE_STAFF) {
        await MailerService.sendVerificationEmail(data.email);
      }

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        if (error.message.includes('UQ_EMPLOYEE_PERSONAL_ID')) {
          throw new DuplicationError(
            'personal_id',
            'Employee.PersonalId.Duplicate',
          );
        }
        if (error.message.includes('UQ_EMPLOYEE_EMAIL')) {
          throw new DuplicationError('email', 'Employee.Email.Duplicate');
        }
        if (error.message.includes('UQ_EMPLOYEE_PHONE')) {
          throw new DuplicationError('phone', 'Employee.Phone.Duplicate');
        }
      }
      throw error;
    }
  })
  .put(
    createValidationGuard(VerifyEmployeeEmailDtoSchema),
    async (req, res) => {
      const token = req.body.verificationToken as string;
      const data = await AccountService.verifyEmail(
        token,
        (req.body as VerifyEmployeeEmailDto).password,
      );

      res.status(StatusCodes.OK).json({
        status: 'success',
        data,
      });
    },
  );

export default handler;
