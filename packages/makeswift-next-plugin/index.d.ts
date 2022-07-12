import type { NextConfig } from 'next'

type MakeswiftNextPluginOptions = { resolveSymlinks?: boolean }

declare function MakeswiftNextPlugin(options?: MakeswiftNextPluginOptions): (config?: NextConfig) => NextConfig

export = MakeswiftNextPlugin
