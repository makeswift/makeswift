// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {{ resolveSymlinks?: boolean; appOrigin?: string; previewMode?: boolean }} MakeswiftNextPluginOptions */
/** @typedef {NonNullable<import('next').NextConfig['images']>} ImageConfig */
/** @typedef {ImageConfig['remotePatterns']} ImageConfigRemotePatterns */

const path = require('path')
const fs = require('fs')
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

// Heavily borrowed from https://github.com/amannn/next-intl/blob/main/packages/next-intl/src/plugin/getNextConfig.tsx

/** @type {(localPath: string) => string[]} */
function withExtensions(localPath) {
  return [
    `${localPath}.ts`,
    `${localPath}.tsx`,
    `${localPath}.js`,
    `${localPath}.jsx`,
  ]
}

/** @type {(cdw?: string) => string | undefined} */
function resolveConfigPath(cwd) {
  function resolvePath(pathname) {
    return path.resolve(...(cwd ? [cwd, pathname] : [pathname]))
  }

  function pathExists(pathname) {
    return fs.existsSync(resolvePath(pathname))
  }

  for (const candidate of [...withExtensions('.')]) {
    if (pathExists(candidate)) {
      return candidate
    }
  }

  return undefined
}

/** @type {(nextConfig: NextConfig | undefined, runtimeConfigModule: string) => NextConfig} */
export function resolveRuntimeConfig(nextConfig, runtimeConfigModule) {
  const useTurbo = process.env.TURBOPACK != null
  const moduleResolutionConfig = {}

  // Assign alias for `next-intl/config`
  if (useTurbo) {
    const configPath = resolveConfigPath()
    if (configPath != null) {
      // `NextConfig['turbo']` is stable in Next.js 15. In case the
      // experimental feature is removed in the future, we should
      // replace this accordingly in a future major version.
      moduleResolutionConfig.experimental = {
        ...nextConfig?.experimental,
        turbo: {
          ...nextConfig?.experimental?.turbo,
          resolveAlias: {
            ...nextConfig?.experimental?.turbo?.resolveAlias,
            [runtimeConfigModule]: configPath,
          },
        },
      }
    }
  } else {
    /** @type {(...[config, options]: Parameters<NonNullable<NextConfig['webpack']>>) => void} */
    moduleResolutionConfig.webpack = function webpack(...[config, options]) {
      // Webpack requires absolute paths
      const configPath = resolveConfigPath(config.context)
      if (configPath != null) {
        config.resolve.alias[runtimeConfigModule] = path.resolve(
          config.context,
          configPath,
        )
      }

      if (typeof nextConfig?.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  }

  return Object.assign({}, nextConfig, moduleResolutionConfig)
}

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
            has: [
              {
                type: 'query',
                key: 'x-makeswift-draft-mode',
                value: '(?<secret>.+)',
              },
            ],
            source: '/:path(.*)',
            destination: '/api/makeswift/proxy-draft-mode',
          },
          {
            has: [
              {
                type: 'header',
                key: 'X-Makeswift-Draft-Mode',
                value: '(?<secret>.+)',
              },
            ],
            source: '/:path(.*)',
            destination: '/api/makeswift/proxy-draft-mode',
          },
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

    if (satisfies(nextVersion, '<13.4.0')) {
      throw new Error('Makeswift requires a minimum Next.js version of 13.4.0.')
    }

    return resolveRuntimeConfig(
      {
        ...enhancedConfig,
        webpack(config, options) {
          config = enhancedConfig.webpack?.(config, options) ?? config

          if (resolveSymlinks != null) config.resolve.symlinks = resolveSymlinks

          return config
        },
      },
      'runtime/.makeswift.config',
    )
  }
