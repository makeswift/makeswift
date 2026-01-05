import type { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    // Jest/JSDOM resolves react-dom/server to server.browser.js via the "browser"
    // export condition, but it uses MessageChannel which isn't available in Node.js.
    // https://github.com/facebook/react/issues/31827
    'react-dom/server': 'react-dom/server.node',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleDirectories: ['node_modules', 'src'],
  testMatch: [
    // "**/__tests__/**/*.[jt]s?(x)",
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  setupFiles: ['./jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts'],
  resolver: `${__dirname}/jest.resolver.js`,
  transform: {
    '^.+\\.(t|j)s?$': '@swc/jest',
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
}

export default config
