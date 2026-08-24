import dotenv from "dotenv"

dotenv.config()

function assertEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: '${key}'`)
  }
  return value
}

function parsePort(port?: string, defaultPort = 3000): number {
  if (!port) return defaultPort
  const parsed = Number(port)
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid port number: '${port}'`)
  }
  return parsed
}

const config = {
  port: parsePort(process.env.PORT, 3000),
  jwt: {
    secret: assertEnvVar("JWT_SECRET"),
    expiresIn: "1d",
  },
  databaseUrl: assertEnvVar("DATABASE_URL"),
} as const

export default config
