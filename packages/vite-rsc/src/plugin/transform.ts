import { type ESTree } from 'vite'

import MagicString from 'magic-string'

export const MARKER_SYMBOL = 'serverOnly'

/**
 * Replaces inline loader functions passed to `serverOnly` or its alias with
 * `replacementExpr` when the `serverOnly` call used as the component argument
 * to `.registerComponent()`, e.g.
 *
 *   runtime.registerComponent(
 *     serverOnly(() =>
 *       import('./server').then((mod) => ({ default: mod.RscMarkdown })),
 *     ),
 *     {
 *     ...
 *     })
 */
export function replaceServerLoaders({
  code,
  ast,
  replacementExpr,
}: {
  code: string
  ast: ESTree.Program
  replacementExpr: string
}) {
  const markerSymbols = collectMarkerSymbols(ast)
  if (markerSymbols.size === 0) return null

  const output = new MagicString(code)
  let changed = false

  visit(ast, node => {
    const loaderExpr = getServerLoaderExpr(markerSymbols, node)
    if (loaderExpr) {
      const { start, end } = loaderExpr
      output.overwrite(start, end, replacementExpr)
      changed = true
    }
  })

  if (!changed) return null

  return {
    code: output.toString(),
    map: output.generateMap({ hires: 'boundary' }),
  }
}

/**
 * Scans AST for imports of the marker symbol from this package
 */
const collectMarkerSymbols = (ast: ESTree.Program): Set<string> => {
  const result = new Set<string>()

  for (const node of ast.body) {
    if (node.type !== 'ImportDeclaration' || node.source.value !== PACKAGE_NAME) continue

    for (const specifier of node.specifiers) {
      if (
        specifier.type === 'ImportSpecifier' &&
        specifier.imported.type === 'Identifier' &&
        specifier.imported.name === MARKER_SYMBOL
      ) {
        result.add(specifier.local.name)
      }
    }
  }

  return result
}

/**
 * Returns the inline server loader from the component argument of a
 * `.registerComponent()` call, or `null` when the node does not match
 */
const getServerLoaderExpr = (
  markerSymbols: Set<string>,
  node: ESTree.Node,
): ESTree.Expression | null => {
  if (!isRegisterComponentCall(node)) return null

  const component = node.arguments[0]
  if (component == null || component.type !== 'CallExpression') return null

  return getMarkedLoaderExpr(markerSymbols, component)
}

const isRegisterComponentCall = (node: ESTree.Node): node is ESTree.CallExpression =>
  node.type === 'CallExpression' &&
  node.callee.type === 'MemberExpression' &&
  !node.callee.computed &&
  node.callee.property.type === 'Identifier' &&
  node.callee.property.name === 'registerComponent'

/**
 * Returns the inline function passed to a recognized marker call, or `null`
 * when the call does not match
 */
const getMarkedLoaderExpr = (
  markerSymbols: Set<string>,
  call: ESTree.CallExpression,
): ESTree.Expression | null => {
  if (
    call.callee.type !== 'Identifier' ||
    !markerSymbols.has(call.callee.name) ||
    call.arguments.length !== 1
  ) {
    return null
  }

  const loader = call.arguments[0]
  return loader.type === 'ArrowFunctionExpression' || loader.type === 'FunctionExpression'
    ? loader
    : null
}

function visit(node: ESTree.Node, callback: (node: ESTree.Node) => void) {
  callback(node)

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) {
        if (isNode(child)) visit(child, callback)
      }
    } else if (isNode(value)) {
      visit(value, callback)
    }
  }
}

const isNode = (value: unknown): value is ESTree.Node =>
  typeof value === 'object' && value != null && 'type' in value
