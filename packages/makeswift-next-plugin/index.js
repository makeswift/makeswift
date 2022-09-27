// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {{ resolveSymlinks?: boolean }} MakeswiftNextPluginOptions */

const withTmInitializer = require('next-transpile-modules')

const NEXT_IMAGE_DOMAINS = ['s.mkswft.com']
const NEXT_TRANSPILE_MODULES_MODULES = ['@makeswift/runtime']

/** @type {(options: MakeswiftNextPluginOptions) => (nextConfig: NextConfig) => NextConfig} */
module.exports =
  ({ resolveSymlinks } = {}) =>
  (nextConfig = {}) => {
    /** @type {NextConfig} */
    const enhancedConfig = {
      ...nextConfig,
      compiler: {
        ...nextConfig.compiler,
        styledComponents: true,
      },
      images: {
        ...nextConfig.images,
        domains: [...(nextConfig.images?.domains ?? []), ...NEXT_IMAGE_DOMAINS],
      },
      async rewrites() {
        const rewrites = await nextConfig.rewrites?.()

        return {
          beforeFiles: [
            {
              has: [
                {
                  type: 'query',
                  key: 'x-makeswift-preview-mode',
                  value: '(?<secret>.+)',
                },
              ],
              source: '/:path(.*)',
              destination: '/api/makeswift/proxy-preview-mode',
            },
            {
              has: [
                {
                  type: 'header',
                  key: 'X-Makeswift-Preview-Mode',
                  value: '(?<secret>.+)',
                },
              ],
              source: '/:path(.*)',
              destination: '/api/makeswift/proxy-preview-mode',
            },
            ...(Array.isArray(rewrites) ? [] : rewrites?.beforeFiles ?? []),
          ],
          afterFiles: Array.isArray(rewrites)
            ? rewrites
            : rewrites?.afterFiles ?? [],
          fallback: Array.isArray(rewrites) ? [] : rewrites?.fallback ?? [],
        }
      },
    }

    return withTmInitializer(NEXT_TRANSPILE_MODULES_MODULES, {
      resolveSymlinks,
    })(enhancedConfig)
  }
