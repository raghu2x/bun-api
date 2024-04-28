export const constants = Object.freeze({
  OTP_LENGTH: 6,
  OTP_CONFIG: {
    upperCaseAlphabets: true,
    specialChars: false
  }
})

export const queryDefault = Object.freeze({
  page: 1,
  size: 99,
  sortBy: null,
  ascending: true
})

export enum USER_TYPES {
  ADMIN = 'admin',
  STUDENT = 'student',
  STAFF = 'staff',
  PARENT = 'parent'
}
