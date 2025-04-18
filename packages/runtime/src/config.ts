import { z } from 'zod'

// @ts-ignore
import getUserConfig from '.makeswift.config'

const configSchema = z.object({
  localizedPagesOnlineByDefault: z.boolean().optional(),
})

export type RuntimeConfig = z.infer<typeof configSchema>

export function getConfig(): Required<RuntimeConfig> {
  const rawConfig = getUserConfig()
  const userConfig = configSchema.parse(rawConfig)

  console.log('--- config', { userConfig })
  return {
    localizedPagesOnlineByDefault: false,
    ...userConfig,
  }
}
