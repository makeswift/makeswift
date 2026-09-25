import config from 'eslint-config'

const runtimeConfig = {
  rules: {
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '^useAsyncEffect$',
      },
    ],
  },
}

export default [...config, runtimeConfig]
