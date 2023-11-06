import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { UpdateEmployeeDto } from 'backend/dtos/employees/UpdateEmployee.dto';
import { UpdateEmployeeDtoSchema } from 'backend/dtos/employees/UpdateEmployee.dto';
import { AccountEntity } from 'backend/entities/account.entity';
import { EmployeeEntity } from 'backend/entities/employee.entity';
import { EmployeeRole } from 'backend/enums/entities.enum';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonEmployeeModel } from 'backend/services/employee/helper';
import { MailerService } from 'backend/services/mailer/mailer.service';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { PopulateEmployeeFields } from 'models/employee.model';

type SuccessResponse = JSSuccess<CommonEmployeeModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);
handler
  .get(async (req, res) => {
    const id = req.query.id as string;
    const data = (await CommonService.getRecord({
      entity: EmployeeEntity,
      filter: {
        id,
      },
      relations: ['account'],
    })) as CommonEmployeeModel;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  .put(createValidationGuard(UpdateEmployeeDtoSchema), async (req, res) => {
    try {
      const id = req.query.id as string;
      const { disabled, ...rest } = req.body as UpdateEmployeeDto;

      const employee = (await CommonService.getRecord({
        entity: EmployeeEntity,
        filter: {
          id,
        },
        relations: ['account'],
      })) as PopulateEmployeeFields<'account'>;
      const accountId = employee.account.id;
      const previousRole = employee.role;
      const newRole = rest.role;
      const verified = employee.account.verified;

      await CommonService.updateRecord(EmployeeEntity, id, rest);

      await CommonService.updateRecord(AccountEntity, accountId, {
        disabled,
      });

      if (
        !verified &&
        previousRole !== newRole &&
        newRole !== EmployeeRole.WAREHOUSE_STAFF
      ) {
        await MailerService.sendVerificationEmail(employee.account.email);
      }

      const updatedEmployee = (await CommonService.getRecord({
        entity: EmployeeEntity,
        filter: {
          id,
        },
      })) as CommonEmployeeModel;

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedEmployee,
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
  });

export default handler;
