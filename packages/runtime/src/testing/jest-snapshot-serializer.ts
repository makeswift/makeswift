import { DEFAULT_CSS_CLASS_NAME_PREFIX } from "../runtimes/react/css-runtime/constants"
import synchronizedPrettier from '@prettier/sync'

function getClassNamesInTree(
  root: Element | Node | NodeList | Element[],
  filter: (className: string) => boolean
): Set<string> {
  const discoveredClassnames = new Set<string>()

  function process(current: Element | Node | NodeList | Element[]) {
    if (!current) return
    if (current instanceof Element) {
      for (const className of current.classList) {
        if (filter(className)) {
          discoveredClassnames.add(className)
        }
      }
      const children = current.children
      for (const child of children) {
        process(child)
      }
    } else if (current instanceof Node) {
      const children = current.childNodes
      for (const child of children) {
        process(child)
      }
    } else if (current instanceof NodeList) {
      for (const child of current) {
        process(child)
      }
    } else if (Array.isArray(current)) {
      for (const arrElement of current) {
        process(arrElement)
      }
    }
  }

  process(root)
  return discoveredClassnames
}

function getCssRulesForClassNames(
  classNames: Set<string>
): CSSRule[] {
  if (classNames.size === 0) return []
  const rules: CSSRule[] = []
  const styleElements = document.querySelectorAll<HTMLStyleElement>('style')
  for (const styleElement of styleElements) {
    if (styleElement.sheet == null) continue
    const cssRules = Array.from(styleElement.sheet.cssRules)
    for (const cssRule of cssRules) {
      for (const className of classNames) {
        if (cssRule.cssText.includes(`.${className}`)) {
          rules.push(cssRule)
          break
        }
      }
    }
  }
  return rules
}

function isElementArray(val: any): boolean {
  return (val && Array.isArray(val) && val.every(v => v instanceof Element))
}

function isMakeswiftClassName(className: string): boolean {
  return className.startsWith(`${DEFAULT_CSS_CLASS_NAME_PREFIX}-`)
}

function formatRule(rule: CSSRule): string {
  const formatted = synchronizedPrettier.format(rule.cssText, {
    parser: 'css',
    tabWidth: 2,
    semi: true,
  })
  return formatted
}

export function createMakeswiftStylesSnapshotSerializer(): jest.SnapshotSerializerPlugin {
  const visited = new WeakSet()
  const isVisited = (val: any) => visited.has(val)

  function test(val: any) {
    return (
      val && !isVisited(val) &&
      (val instanceof Element || val instanceof Node || val instanceof NodeList || isElementArray(val))
    )
  }

  function serialize(
    val: any,
    config: any,
    indentation: any,
    depth: any,
    refs: any,
    printer: any
  ) {
    visited.add(val)
    try {
      if (depth === 0) {
        const classNames = getClassNamesInTree(val, isMakeswiftClassName)
        const matchingCssRules = getCssRulesForClassNames(classNames)
        const formattedRules = matchingCssRules.map(rule => formatRule(rule))
        const rulesToAppendToSnapshot = (formattedRules.length > 0) ? formattedRules.join('\n') + '\n\n' : ''
        return `${rulesToAppendToSnapshot}${printer(val, config, indentation, depth, refs)}`
      } else {
        // we only add css rules at depth 0, so just delegate to the default printer
        return printer(val, config, indentation, depth, refs)
      }
    } finally {
      visited.delete(val)
    }
  }

  return {
    test,
    serialize
  }
}