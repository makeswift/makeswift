import type { Config } from 'jest'

const config: Config = {
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
  snapshotSerializers: ['@emotion/jest/serializer'],
  moduleNameMapper: {
    // FIXME: Tests are not picking up dependencies
    '^@makeswift/controls$': '<rootDir>/node_modules/@makeswift/controls/dist/esm/index.js',
    '^@makeswift/prop-controllers$':
      '<rootDir>/node_modules/@makeswift/prop-controllers/dist/esm/index.js',
  },
}

export default config
