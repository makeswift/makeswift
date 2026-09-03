import { parse } from 'acorn'
import { type ESTree } from 'vite'

import { replaceServerLoaders } from './transform'

const REPLACEMENT_EXPR = "() => Promise.reject(new Error('Invalid import'))"

const transform = (code: string) =>
  replaceServerLoaders({
    code,
    parse: code => parse(code, { ecmaVersion: 'latest', sourceType: 'module' }) as ESTree.Program,
    replacementExpr: REPLACEMENT_EXPR,
  })

describe('replaceServerLoaders', () => {
  test('replaces an inline loader registered through `serverOnly`', () => {
    const loader = "() => import('./server')"
    const code = [
      `import { serverOnly } from '${PACKAGE_NAME}'`,
      `function register(rtm) { rtm.registerComponent(serverOnly(${loader}), {}) }`,
    ].join('\n')

    expect(transform(code)?.code).toBe(code.replace(loader, REPLACEMENT_EXPR))
  })

  test('supports an aliased `serverOnly` import', () => {
    const loader = "() => import('./server')"
    const code = [
      `import { serverOnly as ifServer } from '${PACKAGE_NAME}'`,
      `runtime.registerComponent(ifServer(${loader}), {})`,
    ].join('\n')

    expect(transform(code)?.code).toBe(code.replace(loader, REPLACEMENT_EXPR))
  })

  test.each([
    {
      name: 'marker imported from another package',
      code: [
        "import { serverOnly } from 'another-package'",
        "runtime.registerComponent(serverOnly(() => import('./server')), {})",
      ].join('\n'),
    },
    {
      name: 'marker of unknown origin',
      code: [
        'const serverOnly = (callback) => callback()',
        "runtime.registerComponent(serverOnly(() => import('./server')), {})",
      ].join('\n'),
    },
    {
      name: 'marker call outside component registration',
      code: [
        `import { serverOnly } from '${PACKAGE_NAME}'`,
        "serverOnly(() => import('./server'))",
      ].join('\n'),
    },
    {
      name: 'loader defined outside component registration',
      code: [
        `import { serverOnly } from '${PACKAGE_NAME}'`,
        "const load = () => import('./server')",
        'runtime.registerComponent(serverOnly(load), {})',
      ].join('\n'),
    },
    {
      name: 'non-member `registerComponent` calls',
      code: [
        `import { serverOnly } from '${PACKAGE_NAME}'`,
        "registerComponent(() => import('./server'), {})",
      ].join('\n'),
    },
  ])('ignores $name', ({ code }) => {
    expect(transform(code)).toBeNull()
  })
})
