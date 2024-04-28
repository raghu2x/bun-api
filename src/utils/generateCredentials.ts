function generateRandomPassword(length: number = 10): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

export interface Credentials {
  id: string
  password: string
}

export function generateTemporaryCredentials(): Credentials {
  // Generate a random temporary ID
  const tempId = Math.random().toString(36).substring(2, 10)

  // Generate a random temporary password
  const tempPassword = generateRandomPassword()

  return { id: tempId, password: tempPassword }
}
