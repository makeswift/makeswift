import { type SetRequired } from 'type-fest'

import { ReactRuntime } from './runtimes/react'

type FontVariant = { weight: string; style: 'italic' | 'normal'; src?: string }

export type Font = {
  family: string
  label?: string
  variants: FontVariant[]
}

type Fonts = Font[]

export type GetFonts = () => Fonts | Promise<Fonts>

export type MakeswiftConfig = {
  runtime: ReactRuntime
  apiKey?: string
  appOrigin?: string
  apiOrigin?: string
  getFonts?: GetFonts
  events?: { onPublish: () => void | Promise<void> }
}

export function configFromArgs(
  apiKeyOrConfig: string | MakeswiftConfig,
  partialConfig?: { runtime: ReactRuntime } & Partial<MakeswiftConfig>,
): MakeswiftConfig {
  if (typeof apiKeyOrConfig === 'object') {
    if (partialConfig) {
      throw new Error('Received multiple configuration arguments; expected only one.')
    }

    return apiKeyOrConfig
  }

  if (partialConfig == null) {
    throw new Error('A configuration argument is required.')
  }

  return {
    apiKey: apiKeyOrConfig,
    ...partialConfig,
  }
}

export type ResolvedMakeswiftConfig = SetRequired<
  MakeswiftConfig,
  'apiKey' | 'apiOrigin' | 'appOrigin'
>

export function resolveConfig({
  apiKey,
  appOrigin,
  apiOrigin,
  ...inputConfig
}: MakeswiftConfig): ResolvedMakeswiftConfig {
  if (apiKey == null) {
    throw new Error('The Makeswift API key is required.')
  }

  return {
    ...inputConfig,
    apiKey,
    appOrigin: appOrigin ?? 'https://app.makeswift.com',
    apiOrigin: apiOrigin ?? 'https://api.makeswift.com',
  }
}
