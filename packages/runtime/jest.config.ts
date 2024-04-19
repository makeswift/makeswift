import type { Config } from 'jest'

const config: Config = {
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleDirectories: ['node_modules', 'src'],
  testMatch: [
    // "**/__tests__/**/*.[jt]s?(x)",
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  transform: {
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
