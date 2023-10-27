import { addHours } from 'date-fns';
import nodemailer from 'nodemailer';

import { CommonService } from '../common/common.service';

import { generateToken } from './helper';

import { AccountEntity } from 'backend/entities/account.entity';
import {
  RESET_PASSWORD_ROUTE,
  VERIFICATION_RESULT_ROUTE,
} from 'constants/routes.ui.constant';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

export class MailerService {
  private static async _getAccountAndToken(
    email: string,
  ): Promise<{ account: AccountEntity; token: string; expiry: Date }> {
    const account = await CommonService.getRecord({
      entity: AccountEntity,
      filter: {
        email,
      },
    });

    const token = generateToken();
    const expiry = addHours(new Date(), 1);

    return { account: account!, token, expiry };
  }

  static async sendResetPasswordEmail(email: string) {
    const { account, token, expiry } = await this._getAccountAndToken(email);

    await CommonService.updateRecord(AccountEntity, account.id, {
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: expiry,
    });
    console.log(
      'file: mailer.service.ts:44 - MailerService - sendResetPasswordEmail - token:',
      token,
    );

    const mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: account.email,
      subject: 'Nutribox - Khôi phục mật khẩu',
      text: `Vui lòng nhấp vào đường dẫn này để khôi phục mật khẩu: ${RESET_PASSWORD_ROUTE}?token=${token}. Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.`,
    };

    return transporter.sendMail(mailOptions);
  }

  static async sendVerificationEmail(email: string): Promise<undefined> {
    try {
      const { account, token, expiry } = await this._getAccountAndToken(email);
      if (account.verified) {
        throw new Error('Account is already verified');
      }
      await CommonService.updateRecord(AccountEntity, account.id, {
        verificationToken: token,
        verificationTokenExpiry: expiry,
      });
      console.log(
        'file: mailer.service.ts:66 - MailerService - sendVerificationEmail - token:',
        token,
      );

      const mailOptions = {
        from: process.env.MAILER_EMAIL,
        to: account.email,
        subject: 'Nutribox - Xác nhận tài khoản',
        text: `Vui lòng nhấp vào đường dẫn này để xác nhận tài khoản: ${VERIFICATION_RESULT_ROUTE}?token=${token}. Nếu bạn không yêu cầu xác nhận tài khoản, vui lòng bỏ qua email này.`,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      /* Do nothing if can't find the account with the corresponding email */
      console.log(
        'file: mailer.service.ts:85 - MailerService - sendVerificationEmail - error:',
        error,
      );
    }
  }
}
