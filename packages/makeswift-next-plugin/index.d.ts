import type { NextConfig } from 'next'

type MakeswiftNextPluginOptions = {
  resolveSymlinks?: boolean
  appOrigin?: string
  previewMode?: boolean
}

declare function MakeswiftNextPlugin(
  options?: MakeswiftNextPluginOptions,
): (config?: NextConfig) => NextConfig

export = MakeswiftNextPlugin
