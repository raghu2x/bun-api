export interface UserRegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  address?: string
}

export type UserTypes = 'staff' | 'admin' | 'student' | 'parent'
export interface LoginData {
  institutionName: string
  userType: UserTypes
  email: string
  password: string
  remember?: boolean
  userId?: string
}

export interface VerificationData {
  email: string
  code?: string
  otp?: string | number
}

export interface PasswordResetData {
  email: string
  password: string
  token: string
}
