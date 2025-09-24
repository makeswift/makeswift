// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {NonNullable<import('next').NextConfig['images']>} ImageConfig */
/** @typedef {ImageConfig['remotePatterns']} ImageConfigRemotePatterns */

/**
 * Configuration options for the Makeswift Next.js plugin
 * @typedef {Object} MakeswiftNextPluginOptions
 * 
 * @property {boolean} [resolveSymlinks] - Whether to resolve symlinks in
 * webpack.
 * 
 * @property {string} [appOrigin] - The origin of the Makeswift builder. Used
 * for CORS headers to allow the builder to communicate with your site
 * 
 * @property {boolean} [disableBuiltInPreview] - Whether to disable Makeswift's
 * built-in preview mode. When true, you must implement a custom preview mode
 * for visual editing to work
 */

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
    disableBuiltInPreview = false,
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
              source: '/:makeswiftRewriteOriginalPath(.*)',
              has: [
                {
                  type: 'query',
                  key: 'makeswift-preview-token',
                  value: '(?<makeswiftRewritePreviewToken>.+)',
                },
              ],
              destination: '/api/makeswift/redirect-preview',
              locale: false,
            },
            {
              source: '/:path(.*)',
              has: [
                {
                  type: 'query',
                  key: 'makeswift-redirect-live',
                  value: '(?<destination>.+)',
                },
              ],
              destination: '/api/makeswift/redirect-live',
              locale: false,
            },
          ]
          return {
            beforeFiles: [
              ...(!disableBuiltInPreview ? previewModeRewrites : []),
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

      if (disableBuiltInPreview) {
        console.log(
          "\nMakeswift's built-in preview mode is disabled. Check that a custom preview mode is implemented to enable visual editing.\n",
        )
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
