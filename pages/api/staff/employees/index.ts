import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { NewEmployeeDto } from 'backend/dtos/employees/NewEmployee.dto';
import { NewEmployeeDtoSchema } from 'backend/dtos/employees/NewEmployee.dto';
import type { VerifyEmployeeEmailDto } from 'backend/dtos/verifyEmployeeEmail.dto';
import { VerifyEmployeeEmailDtoSchema } from 'backend/dtos/verifyEmployeeEmail.dto';
import { EmployeeEntity } from 'backend/entities/employee.entity';
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
import { MailerService } from 'backend/services/mailer/mailer.service';
import type { AccountWithPopulatedSide } from 'backend/types/auth';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { EmployeeModel } from 'models/employee.model';

type SuccessResponse = JSSuccess<
  EmployeeModel[] | AccountWithPopulatedSide<'employee'>
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
    };

    if (keyword) {
      const data = (await CommonService.getRecordsByKeyword({
        ...commonArgs,
        searchParams: {
          keyword,
          fieldName: 'name',
          limit: paginationParams.limit,
        },
      })) as EmployeeModel[];

      res.status(StatusCodes.OK).json({
        status: 'success',
        data,
      });
    } else {
      const [data, totalRecords] = await CommonService.getRecords({
        ...commonArgs,
        paginationParams,
      });

      setPaginationHeader(res, {
        ...paginationParams,
        totalRecords,
      });

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: data as EmployeeModel[],
      });
    }
  })
  .post(createValidationGuard(NewEmployeeDtoSchema), async (req, res) => {
    try {
      const data = await AccountService.createEmployeeAccount(
        req.body as NewEmployeeDto,
      );
      await MailerService.sendVerificationEmail(data.email);

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
