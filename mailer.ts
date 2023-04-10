import crypto from 'crypto';

import nodemailer from 'nodemailer';

import AccountModel from 'api/models/Account.model';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string) {
  const user = await AccountModel().findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 3600000; // Token expires in 1 hour

  user.verificationToken = token;
  user.verificationTokenExpires = new Date(expires);

  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Account Verification',
    text: `Please click the following link to verify your account: ${process.env.NEXT_PUBLIC_DOMAIN_URL}/mail/verify?token=${token}`,
  };

  return transporter.sendMail(mailOptions);
}

export default transporter;
