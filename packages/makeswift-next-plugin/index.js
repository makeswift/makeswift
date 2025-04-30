// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {{ resolveSymlinks?: boolean; appOrigin?: string; previewMode?: boolean }} MakeswiftNextPluginOptions */
/** @typedef {NonNullable<import('next').NextConfig['images']>} ImageConfig */
/** @typedef {ImageConfig['remotePatterns']} ImageConfigRemotePatterns */

const { satisfies } = require('semver')

const GOOGLE_STORAGE_BUCKETS = [
  's.mkswft.com',
  's.staging.mkswft.com',
  's-development.cd.mkswft.com',
]
/** @type ImageConfigRemotePatterns */
const NEXT_IMAGE_REMOTE_PATTERNS = GOOGLE_STORAGE_BUCKETS.map((bucket) => ({
  protocol: 'https',
  hostname: 'storage.googleapis.com',
  pathname: `/${bucket}/**`,
}))
/** @type ImageConfigRemotePatterns */
const NEXT_IMAGE_REVIEW_APP_REMOTE_PATTERNS = [
  {
    protocol: 'https',
    hostname: 'storage.googleapis.com',
    pathname: '/s-*.cd.mkswft.com/**',
  },
]

/** @type {(options: MakeswiftNextPluginOptions) => (nextConfig: NextConfig) => NextConfig} */
module.exports =
  ({
    resolveSymlinks,
    appOrigin = 'https://app.makeswift.com',
    previewMode = true,
  } = {}) =>
    (nextConfig = {}) => {
      /** @type {NextConfig} */
      let enhancedConfig = {
        ...nextConfig,
        images: {
          ...nextConfig.images,
          remotePatterns: [
            ...(nextConfig.images?.remotePatterns ?? []),
            ...NEXT_IMAGE_REMOTE_PATTERNS,
            ...NEXT_IMAGE_REVIEW_APP_REMOTE_PATTERNS,
          ],
        },
        async rewrites() {
          const rewrites = await nextConfig.rewrites?.()
          const previewModeRewrites = [
            {
              source: '/:path(.*)',
              has: [
                {
                  type: 'query',
                  key: 'x-makeswift-draft-mode',
                  value: '(?<secret>.+)',
                },
              ],
              destination: '/api/makeswift/draft',
            },
            {
              source: '/:path(.*)',
              has: [
                {
                  type: 'query',
                  key: 'x-makeswift-preview-mode',
                  value: '(?<secret>.+)',
                },
              ],
              destination: '/api/makeswift/preview',
            },
          ]
          return {
            beforeFiles: [
              ...(previewMode ? previewModeRewrites : []),
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

      if (satisfies(nextVersion, '<13.4.0')) {
        throw new Error('Makeswift requires a minimum Next.js version of 13.4.0.')
      }

      return {
        ...enhancedConfig,
        webpack(config, options) {
          config = enhancedConfig.webpack?.(config, options) ?? config

          if (resolveSymlinks != null) config.resolve.symlinks = resolveSymlinks

          return config
        },
      }
    }
