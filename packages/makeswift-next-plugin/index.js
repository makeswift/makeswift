// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {{ resolveSymlinks?: boolean; appOrigin?: string }} MakeswiftNextPluginOptions */
/** @typedef {NonNullable<import('next').NextConfig['images']>} ImageConfig */
/** @typedef {ImageConfig['domains']} ImageConfigDomains */

const withTmInitializer = require('next-transpile-modules')

const NEXT_TRANSPILE_MODULES_MODULES = ['@makeswift/runtime']
const GOOGLE_STORAGE_BUCKETS = [
  's.mkswft.com',
  's.staging.mkswft.com',
  's-development.cd.mkswft.com',
]
/** @type ImageConfigDomains */
const NEXT_IMAGE_DOMAINS = ['storage.googleapis.com', ...GOOGLE_STORAGE_BUCKETS]

/** @type {(options: MakeswiftNextPluginOptions) => (nextConfig: NextConfig) => NextConfig} */
module.exports =
  ({ resolveSymlinks, appOrigin = 'https://app.makeswift.com' } = {}) =>
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

    return withTmInitializer(NEXT_TRANSPILE_MODULES_MODULES, {
      resolveSymlinks,
    })(enhancedConfig)
  }
