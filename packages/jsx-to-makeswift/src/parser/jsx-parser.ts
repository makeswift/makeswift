import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

import type { ParsedJSXElement } from '../types'

import type { ParseResult, ParserOptions } from './types'

const DEFAULT_OPTIONS: ParserOptions = {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
}

type ExtractClassNameResult = {
  className: string | null
  isDynamic: boolean
}

function extractClassName(
  node: t.JSXAttribute | undefined,
): ExtractClassNameResult {
  if (!node || !node.value) {
    return { className: null, isDynamic: false }
  }

  if (t.isStringLiteral(node.value)) {
    return { className: node.value.value, isDynamic: false }
  }

  if (t.isJSXExpressionContainer(node.value)) {
    const expression = node.value.expression

    if (t.isStringLiteral(expression)) {
      return { className: expression.value, isDynamic: false }
    }

    if (t.isTemplateLiteral(expression) && expression.quasis.length === 1) {
      return {
        className: expression.quasis[0].value.raw,
        isDynamic: false,
      }
    }

    return { className: null, isDynamic: true }
  }

  return { className: null, isDynamic: false }
}

type ExtractAttributesResult = {
  attributes: Record<string, unknown>
  className: string | null
}

function extractAttributes(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[],
): ExtractAttributesResult {
  const result: Record<string, unknown> = {}
  let className: string | null = null

  for (const attr of attributes) {
    if (t.isJSXSpreadAttribute(attr)) {
      continue
    }

    const name = t.isJSXIdentifier(attr.name)
      ? attr.name.name
      : t.isJSXNamespacedName(attr.name)
        ? `${attr.name.namespace.name}:${attr.name.name.name}`
        : null

    if (!name) continue

    if (name === 'className' || name === 'class') {
      const extracted = extractClassName(attr)
      className = extracted.className
      continue
    }

    if (!attr.value) {
      result[name] = true
      continue
    }

    if (t.isStringLiteral(attr.value)) {
      result[name] = attr.value.value
    } else if (t.isJSXExpressionContainer(attr.value)) {
      const expr = attr.value.expression

      if (t.isStringLiteral(expr)) {
        result[name] = expr.value
      } else if (t.isNumericLiteral(expr)) {
        result[name] = expr.value
      } else if (t.isBooleanLiteral(expr)) {
        result[name] = expr.value
      } else if (t.isNullLiteral(expr)) {
        result[name] = null
      } else {
        result[name] = '[dynamic]'
      }
    }
  }

  return { attributes: result, className }
}

type TextExtractionResult = {
  textContent: string | null
  hasRichContent: boolean
}

function extractTextContent(
  children: t.Node[],
): TextExtractionResult {
  const textParts: string[] = []
  let hasRichContent = false

  for (const child of children) {
    if (t.isJSXText(child)) {
      const trimmed = child.value.trim()
      if (trimmed) {
        textParts.push(trimmed)
      }
    } else if (t.isJSXExpressionContainer(child)) {
      if (t.isStringLiteral(child.expression)) {
        textParts.push(child.expression.value)
      } else if (!t.isJSXEmptyExpression(child.expression)) {
        textParts.push('[dynamic]')
      }
    } else if (t.isJSXElement(child)) {
      hasRichContent = true
      const nested = extractTextContent(child.children)
      if (nested.textContent) {
        textParts.push(nested.textContent)
      }
    }
  }

  return {
    textContent: textParts.length > 0 ? textParts.join(' ') : null,
    hasRichContent,
  }
}

function processJSXElement(node: t.JSXElement): ParsedJSXElement {
  const opening = node.openingElement
  const tagName = t.isJSXIdentifier(opening.name)
    ? opening.name.name
    : t.isJSXMemberExpression(opening.name)
      ? `${getMemberExpressionName(opening.name)}`
      : 'unknown'

  const { attributes, className } = extractAttributes(opening.attributes)
  const { textContent, hasRichContent } = extractTextContent(node.children)

  const children: ParsedJSXElement[] = []
  for (const child of node.children) {
    if (t.isJSXElement(child)) {
      children.push(processJSXElement(child))
    }
  }

  return {
    tagName,
    className,
    attributes,
    textContent,
    children,
    hasRichContent,
  }
}

function getMemberExpressionName(node: t.JSXMemberExpression): string {
  const parts: string[] = []

  let current: t.JSXMemberExpression | t.JSXIdentifier = node

  while (t.isJSXMemberExpression(current)) {
    parts.unshift(current.property.name)
    current = current.object
  }

  if (t.isJSXIdentifier(current)) {
    parts.unshift(current.name)
  }

  return parts.join('.')
}

export function parseJSX(
  source: string,
  options: ParserOptions = {},
): ParseResult {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  const elements: ParsedJSXElement[] = []
  const errors: string[] = []

  try {
    const ast = parse(source, {
      sourceType: mergedOptions.sourceType,
      plugins: mergedOptions.plugins,
    })

    traverse(ast, {
      JSXElement(path) {
        if (!path.parentPath.isJSXElement()) {
          elements.push(processJSXElement(path.node))
        }
      },
    })
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : 'Unknown parsing error',
    )
  }

  return { elements, errors }
}

export function parseJSXFragment(source: string): ParseResult {
  const wrapped = `<>${source}</>`
  const result = parseJSX(wrapped)

  if (result.elements.length === 1 && result.elements[0].tagName === '') {
    return {
      elements: result.elements[0].children,
      errors: result.errors,
    }
  }

  return result
}
