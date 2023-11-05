import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateEmployeeDtoSchema } from 'backend/dtos/employees/UpdateEmployee.dto';
import { EmployeeEntity } from 'backend/entities/employee.entity';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { EmployeeModel } from 'models/employee.model';

type SuccessResponse = JSSuccess<EmployeeModel>;

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
    })) as EmployeeModel;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  .put(createValidationGuard(UpdateEmployeeDtoSchema), async (req, res) => {
    try {
      const id = req.query.id as string;
      const updatedEmployee = (await CommonService.updateRecord(
        EmployeeEntity,
        id,
        req.body,
      )) as EmployeeModel;

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
