import type { Config } from 'jest'

const baseConfig: Config = {
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

const config: Config = {
  projects: [
    {
      ...baseConfig,
      displayName: 'react-latest',
      testPathIgnorePatterns: ['\\.react18\\.test\\.'],
      moduleNameMapper: {
        // Jest/JSDOM resolves react-dom/server to server.browser.js via the "browser"
        // export condition, but it uses MessageChannel which isn't available in Node.js.
        // https://github.com/facebook/react/issues/31827
        'react-dom/server': 'react-dom/server.node',
      },
    },
    {
      ...baseConfig,
      displayName: 'react-18',
      testMatch: ['**/*.react18.test.[tj]s?(x)'],
      testPathIgnorePatterns: [],
      moduleNameMapper: {
        '^react$': '<rootDir>/node_modules/react-18',
        '^react/(.*)$': '<rootDir>/node_modules/react-18/$1',
        '^react-dom$': '<rootDir>/node_modules/react-dom-18',
        '^react-dom/(.*)$': '<rootDir>/node_modules/react-dom-18/$1',
        'react-dom/server': '<rootDir>/node_modules/react-dom-18/server.node.js',
      },
    },
  ],
}

export default config
