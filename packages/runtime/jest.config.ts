import type { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    'react-dom/server': '<rootDir>/node_modules/react-dom/server.browser.js',
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
