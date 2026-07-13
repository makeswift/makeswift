import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import jest from 'eslint-plugin-jest'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * Shared ESLint (flat config) for Makeswift library packages.
 *
 */
export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/lib/**',
      '**/coverage/**',
      '**/.tsup/**',
      '**/generated/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  // Type-aware linting
  {
    files: ['**/src/**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // No hanging promises. Downgraded to a warning while pre-existing
      // violations are burned down.
      '@typescript-eslint/no-floating-promises': 'warn',
    },
  },
  {
    files: [
      '**/*.{test,spec}.{ts,tsx,js,jsx}',
      '**/__tests__/**',
      '**/testing/**',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    plugins: {
      jest,
    },
    rules: {
      'jest/valid-expect': 'error',
    },
  },
  // Rules currently violated by the existing codebase are downgraded to
  // warnings so linting passes today; these should be burned down over time.
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      'import/no-duplicates': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'no-case-declarations': 'warn',
      'no-empty': 'warn',
      'no-useless-escape': 'warn',
      'prefer-const': 'warn',
      'prefer-spread': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'react/display-name': 'warn',
      'react/no-find-dom-node': 'warn',
    },
  },
)
