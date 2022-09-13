const withTmInitializer = require('next-transpile-modules')

const NEXT_IMAGE_DOMAINS = ['s.mkswft.com']
const NEXT_TRANSPILE_MODULES_MODULES = ['@makeswift/runtime']

module.exports =
  ({ resolveSymlinks } = {}) =>
  (nextConfig = {}) => {
    /** @type {import('next').NextConfig} */
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
    }

    return withTmInitializer(NEXT_TRANSPILE_MODULES_MODULES, { resolveSymlinks })(enhancedConfig)
  }
