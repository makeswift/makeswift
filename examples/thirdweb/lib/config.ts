export type Config = {
  makeswiftSiteApiKey: string
}

function getEnvVarOrThrow(key: string): string {
  const value = process.env[key]

  if (!value) throw new Error(`"${key}" env var is not defined.`)

  return value
}

export function getConfig(): Config {
  return {
    makeswiftSiteApiKey: getEnvVarOrThrow('MAKESWIFT_SITE_API_KEY'),
  }
}
