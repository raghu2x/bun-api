export const env = (key: string, defaultValue: string | null = null): string => {
  return (process.env[key] ?? defaultValue) as string
}

export const envOrFail = (key: string): string => {
  if (typeof process.env[key] === 'undefined') {
    throw new Error(`😣 ENV not configured for key: '${key}'.`)
  }

  return process.env[key] as string
}
