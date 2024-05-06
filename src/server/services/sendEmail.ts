import { MAIL_SETTINGS, type MailSetting } from '@/config'
import nodemailer, { type SendMailOptions, type SentMessageInfo } from 'nodemailer'

import { compileTemplate } from './templateParser'

interface MailParams {
  to: string
  subject?: string
  template?: string
  // Add any other parameters you expect for the email here
}

const sendMail = async (params: MailParams): Promise<SentMessageInfo> => {
  const mailTeansportOptions: MailSetting = {
    ...MAIL_SETTINGS,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD
    }
  }
  const transporter = nodemailer.createTransport(mailTeansportOptions)
  const html = compileTemplate('sendOTP.html', params)

  try {
    const mailOptions: SendMailOptions = {
      from: process.env.MAIL_EMAIL,
      to: params.to,
      subject: params.subject ?? 'Hello ✔', // Use the provided subject or a default value
      html
    }
    const info = await transporter.sendMail(mailOptions)
    // console.log('_______________email send', info)
    return info
  } catch (error) {
    // console.log('_______________email not send')
    throw new Error('unable to send mail')
  }
}

export default sendMail
