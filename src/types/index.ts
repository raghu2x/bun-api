declare module 'bun' {
  interface Env {
    API_PORT: string
    PATH: string
    MONGO_URI: string
    MASTER_DB: string

    // # JWT Static Key
    JWT_TOKEN: string
    JWT_TOKEN_EXPIRY: string

    // # headers key for authentication
    HEADER_TOKEN_KEY: string

    // #mail credentials
    MAIL_EMAIL: string
    MAIL_PASSWORD: string
  }
}
