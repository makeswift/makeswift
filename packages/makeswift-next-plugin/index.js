// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {{ resolveSymlinks?: boolean; appOrigin?: string; previewMode?: boolean }} MakeswiftNextPluginOptions */
/** @typedef {NonNullable<import('next').NextConfig['images']>} ImageConfig */
/** @typedef {ImageConfig['domains']} ImageConfigDomains */
/** @typedef {ImageConfig['remotePatterns']} ImageConfigRemotePatterns */

const withTmInitializer = require('./lib/next-transpile-modules')
const { satisfies } = require('semver')

const NEXT_TRANSPILE_MODULES_MODULES = ['@makeswift/runtime']
const GOOGLE_STORAGE_BUCKETS = [
  's.mkswft.com',
  's.staging.mkswft.com',
  's-development.cd.mkswft.com',
]
/** @type ImageConfigDomains */
const NEXT_IMAGE_DOMAINS = GOOGLE_STORAGE_BUCKETS
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
        domains: [...(nextConfig.images?.domains ?? []), ...NEXT_IMAGE_DOMAINS],
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

    if (satisfies(nextVersion, '<12.2.0')) {
      throw new Error(
        'Makeswift requires a minimum Next.js version of 12.2.0. Please upgrade to Next.js version ^12.2.0 if you want to use Next.js v12, or version ^13.0.0 if you want to use Next.js v13.',
      )
    }

    if (satisfies(nextVersion, '<12.3.0')) {
      enhancedConfig = {
        ...enhancedConfig,
        experimental: {
          ...enhancedConfig.experimental,
          images: {
            ...enhancedConfig.experimental?.images,
            remotePatterns: [
              ...(enhancedConfig.experimental?.images?.remotePatterns ?? []),
              ...NEXT_IMAGE_REMOTE_PATTERNS,
              ...NEXT_IMAGE_REVIEW_APP_REMOTE_PATTERNS,
            ],
          },
        },
      }
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
        webpack(config, options) {
          config = enhancedConfig.webpack?.(config, options) ?? config

          if (resolveSymlinks != null) config.resolve.symlinks = resolveSymlinks

          return config
        },
      }
    }

    return {
      ...enhancedConfig,
      transpilePackages: [
        ...(nextConfig?.transpilePackages ?? []),
        ...NEXT_TRANSPILE_MODULES_MODULES,
      ],
      webpack(config, options) {
        config = enhancedConfig.webpack?.(config, options) ?? config

        if (resolveSymlinks != null) config.resolve.symlinks = resolveSymlinks

        return config
      },
    }
  }
