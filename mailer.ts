import crypto from 'crypto';

import nodemailer from 'nodemailer';

import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string) {
  // const user = await AccountModel().findOne({ email });
  // if (!user) {
  //   throw new Error('User not found');
  // }

  const token = crypto.randomBytes(20).toString('hex');
  // const expirationDate = Date.now() + 3600000; // Token expires in 1 hour

  // user.verificationToken = token;
  // user.verificationTokenExpires = new Date(expirationDate);

  // await user.save();

  await executeUsp('usp_VerificationToken_CreateOne', [
    {
      name: 'AccountEmail',
      type: sql.NVarChar,
      value: email,
    },
    {
      name: 'Token',
      type: sql.NVarChar,
      value: token,
    },
  ]);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Nutribox - Xác thực tài khoản',
    text: `Vui hãy nhấp vào đường dẫn này để xác thực tài khoản của bạn: ${process.env.NEXT_PUBLIC_DOMAIN_URL}/mail/verify?token=${token}. Nếu bạn không yêu cầu xác thực mật khẩu, vui lòng bỏ qua email này.`,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendResetPasswordEmail(email: string) {
  // const user = await AccountModel().findOne({ email });
  // if (!user) {
  //   throw new Error('User not found');
  // }

  const token = crypto.randomBytes(20).toString('hex');
  // const expires = Date.now() + 3600000; // Token expires in 1 hour

  // user.forgotPasswordToken = token;
  // user.forgotPasswordExpires = new Date(expires);

  // await user.save();

  await executeUsp('usp_ForgotPasswordToken_CreateOne', [
    {
      name: 'AccountEmail',
      type: sql.NVarChar,
      value: email,
    },
    {
      name: 'Token',
      type: sql.NVarChar,
      value: token,
    },
  ]);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Nutribox - Khôi phục mật khẩu',
    text: `Vui lòng nhấp vào đường dẫn này để khôi phục mật khẩu: ${process.env.NEXT_PUBLIC_DOMAIN_URL}/mail/reset-password?token=${token}. Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.`,
  };

  return transporter.sendMail(mailOptions);
}

export default transporter;
