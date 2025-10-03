import type { NextConfig } from 'next'

type MakeswiftNextPluginOptions = {
  /**
   * Whether to resolve symlinks in webpack
   *
   */
  resolveSymlinks?: boolean
  /**
   * The origin of the Makeswift builder. Used for CORS headers to allow the
   * builder to communicate with your site
   *
   */
  appOrigin?: string
  /**
   * Whether to disable Makeswift's built-in preview mode. When true, you must
   * implement a custom preview mode for visual editing to work. Defaults to
   * `false`.
   *
   */
  disableBuiltInPreview?: boolean
}

declare function MakeswiftNextPlugin(
  options?: MakeswiftNextPluginOptions,
): (config?: NextConfig) => NextConfig

export = MakeswiftNextPlugin
