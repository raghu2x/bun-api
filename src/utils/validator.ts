/* eslint-disable no-useless-escape */
interface Rules<T = RegExp> {
  password: T
  email: T
}

interface ValidationRule {
  validator: (value: string) => boolean
  message: string
}

const patterns: Rules<RegExp> = {
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
}

const messages: Rules<string> = {
  email: 'Invalid email address',
  password:
    'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, and one number'
}

// validation function
export const validate = (rule: keyof Rules): ValidationRule => {
  return {
    validator: (v: string) => patterns[rule].test(v),
    message: messages[rule]
  }
}
