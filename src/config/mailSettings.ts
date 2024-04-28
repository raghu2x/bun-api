export interface MailSetting {
  readonly host: string
  readonly port: number
  readonly secure: boolean
  readonly auth?: {
    readonly user?: string
    readonly pass?: string
  }
}

export const MAIL_SETTINGS: MailSetting = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true // true for 465, false for other ports
}
