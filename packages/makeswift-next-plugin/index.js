// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {{ resolveSymlinks?: boolean; appOrigin?: string }} MakeswiftNextPluginOptions */

const withTmInitializer = require('next-transpile-modules')
const { satisfies } = require('semver')

const NEXT_IMAGE_DOMAINS = ['s.mkswft.com']
const NEXT_TRANSPILE_MODULES_MODULES = ['@makeswift/runtime']

/** @type {(options: MakeswiftNextPluginOptions) => (nextConfig: NextConfig) => NextConfig} */
module.exports =
  ({ resolveSymlinks, appOrigin = 'https://app.makeswift.com' } = {}) =>
  (nextConfig = {}) => {
    /** @type {NextConfig} */
    const enhancedConfig = {
      ...nextConfig,
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
              locale: false,
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
              locale: false,
            },
            ...(Array.isArray(rewrites) ? [] : rewrites?.beforeFiles ?? []),
          ],
          afterFiles: Array.isArray(rewrites)
            ? rewrites
            : rewrites?.afterFiles ?? [],
          fallback: Array.isArray(rewrites) ? [] : rewrites?.fallback ?? [],
        }
      },
      async headers() {
        const headers = (await nextConfig.headers?.()) ?? []

        return [
          ...headers,
          {
            source: '/:path*',
            has: [
              {
                type: 'query',
                key: 'x-makeswift-allow-origin',
                value: 'true',
              },
            ],
            headers: [
              {
                key: 'Access-Control-Allow-Origin',
                value: appOrigin,
              },
            ],
          },
        ]
      },
    }

    const nextVersion = require('next/package.json').version

    if (satisfies(nextVersion, '<12.2.0')) {
      throw new Error(
        'Makeswift requires a minimum Next.js version of 12.2.0. Please upgrade to Next.js version ^12.2.0 if you want to use Next.js v12, or version ^13.0.0 if you want to use Next.js v13.',
      )
    }

    if (satisfies(nextVersion, '<13.0.0')) {
      return withTmInitializer(NEXT_TRANSPILE_MODULES_MODULES, {
        resolveSymlinks,
      })(enhancedConfig)
    }

    if (satisfies(nextVersion, '<13.1.0')) {
      return {
        ...enhancedConfig,
        experimental: {
          ...enhancedConfig.experimental,
          transpilePackages: [
            ...(enhancedConfig.experimental?.transpilePackages ?? []),
            ...NEXT_TRANSPILE_MODULES_MODULES,
          ],
        },
      }
    }

    return {
      ...enhancedConfig,
      transpilePackages: [
        ...(nextConfig?.transpilePackages ?? []),
        ...NEXT_TRANSPILE_MODULES_MODULES,
      ],
    }
  }
