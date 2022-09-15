const withTmInitializer = require("next-transpile-modules");

const NEXT_IMAGE_DOMAINS = ["s.mkswft.com"];
const NEXT_TRANSPILE_MODULES_MODULES = ["@makeswift/runtime"];

module.exports = ({ resolveSymlinks } = {}) => (nextConfig = {}) =>
  withTmInitializer(NEXT_TRANSPILE_MODULES_MODULES, { resolveSymlinks })({
    ...nextConfig,
    images: {
      ...nextConfig.images,
      domains: [...(nextConfig.images?.domains ?? []), ...NEXT_IMAGE_DOMAINS],
    },
    experimental: {
      swcPlugins: [
        "../modules-swc-plugin",
        { displayName: true, basePath: __dirname },
      ],
    },
  });
