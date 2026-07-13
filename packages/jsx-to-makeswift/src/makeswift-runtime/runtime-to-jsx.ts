/**
 * @fileoverview Converts Makeswift runtime schemas to JSX with Tailwind.
 *
 * This module handles the actual Makeswift page data format and converts it
 * to JSX source code with Tailwind CSS classes.
 */

import { addDevicePrefix } from '../utils/device-prefixes'
import type {
  MakeswiftChildren,
  MakeswiftDeviceValue,
  MakeswiftElement,
  MakeswiftMarginValue,
  MakeswiftPaddingValue,
  MakeswiftRichTextV2,
  MakeswiftRuntimeSchema,
  MakeswiftSizeValue,
  MakeswiftTypographyStyle,
} from './types'

export type RuntimeToJSXOptions = {
  indent?: string
  includeKeys?: boolean
}

export type RuntimeToJSXResult = {
  jsx: string
  warnings: string[]
}

const DEFAULT_OPTIONS: Required<RuntimeToJSXOptions> = {
  indent: '  ',
  includeKeys: false,
}

const COMPONENT_TO_TAG: Record<string, string> = {
  './components/Box/index.js': 'div',
  './components/Text/index.js': 'p',
  './components/Image/index.js': 'img',
  './components/Button/index.js': 'button',
  './components/Link/index.js': 'a',
  './components/Video/index.js': 'video',
  './components/Embed/index.js': 'div',
  './components/Form/index.js': 'form',
  './components/Input/index.js': 'input',
  './components/Textarea/index.js': 'textarea',
  './components/Select/index.js': 'select',
  './components/Checkbox/index.js': 'input',
  './components/Radio/index.js': 'input',
  './components/Navigation/index.js': 'nav',
  './components/Root/index.js': 'div',
}

const SPACING_PX_TO_TAILWIND: Record<number, string> = {
  0: '0',
  1: 'px',
  2: '0.5',
  4: '1',
  6: '1.5',
  8: '2',
  10: '2.5',
  12: '3',
  14: '3.5',
  16: '4',
  20: '5',
  24: '6',
  28: '7',
  32: '8',
  36: '9',
  40: '10',
  44: '11',
  48: '12',
  56: '14',
  64: '16',
  80: '20',
  96: '24',
  112: '28',
  128: '32',
  144: '36',
  160: '40',
  176: '44',
  192: '48',
  208: '52',
  224: '56',
  240: '60',
  256: '64',
  288: '72',
  320: '80',
  384: '96',
}

const FONT_SIZE_PX_TO_TAILWIND: Record<number, string> = {
  12: 'xs',
  14: 'sm',
  16: 'base',
  18: 'lg',
  20: 'xl',
  24: '2xl',
  30: '3xl',
  36: '4xl',
  48: '5xl',
  60: '6xl',
  72: '7xl',
  96: '8xl',
  128: '9xl',
}

const FONT_WEIGHT_TO_TAILWIND: Record<number, string> = {
  100: 'thin',
  200: 'extralight',
  300: 'light',
  400: 'normal',
  500: 'medium',
  600: 'semibold',
  700: 'bold',
  800: 'extrabold',
  900: 'black',
}

const LINE_HEIGHT_TO_TAILWIND: Record<number, string> = {
  1: 'none',
  1.25: 'tight',
  1.375: 'snug',
  1.5: 'normal',
  1.625: 'relaxed',
  2: 'loose',
}

function pxToSpacingClass(px: number, prefix: string): string {
  const scale = SPACING_PX_TO_TAILWIND[px]
  if (scale) {
    return `${prefix}${scale}`
  }
  return `${prefix}[${px}px]`
}

function processPadding(
  padding: MakeswiftDeviceValue<MakeswiftPaddingValue>[],
): string[] {
  const classes: string[] = []

  for (const { deviceId, value } of padding) {
    const pt = value.paddingTop
    const pr = value.paddingRight
    const pb = value.paddingBottom
    const pl = value.paddingLeft

    const ptVal = typeof pt === 'object' ? pt?.value : pt
    const prVal = typeof pr === 'object' ? pr?.value : pr
    const pbVal = typeof pb === 'object' ? pb?.value : pb
    const plVal = typeof pl === 'object' ? pl?.value : pl

    if (
      ptVal !== undefined &&
      ptVal === prVal &&
      ptVal === pbVal &&
      ptVal === plVal
    ) {
      classes.push(addDevicePrefix(pxToSpacingClass(ptVal, 'p-'), deviceId))
    } else {
      if (ptVal !== undefined && ptVal === pbVal && prVal === plVal && ptVal !== prVal) {
        classes.push(addDevicePrefix(pxToSpacingClass(ptVal, 'py-'), deviceId))
        if (prVal !== undefined) {
          classes.push(addDevicePrefix(pxToSpacingClass(prVal, 'px-'), deviceId))
        }
      } else {
        if (ptVal !== undefined) {
          classes.push(addDevicePrefix(pxToSpacingClass(ptVal, 'pt-'), deviceId))
        }
        if (prVal !== undefined) {
          classes.push(addDevicePrefix(pxToSpacingClass(prVal, 'pr-'), deviceId))
        }
        if (pbVal !== undefined) {
          classes.push(addDevicePrefix(pxToSpacingClass(pbVal, 'pb-'), deviceId))
        }
        if (plVal !== undefined) {
          classes.push(addDevicePrefix(pxToSpacingClass(plVal, 'pl-'), deviceId))
        }
      }
    }
  }

  return classes
}

function processMargin(
  margin: MakeswiftDeviceValue<MakeswiftMarginValue>[],
): string[] {
  const classes: string[] = []

  for (const { deviceId, value } of margin) {
    const mt = value.marginTop
    const mr = value.marginRight
    const mb = value.marginBottom
    const ml = value.marginLeft

    if (mr === 'auto' && ml === 'auto') {
      classes.push(addDevicePrefix('mx-auto', deviceId))
    } else {
      if (ml === 'auto') {
        classes.push(addDevicePrefix('ml-auto', deviceId))
      } else if (typeof ml === 'object' && ml?.value !== undefined) {
        classes.push(addDevicePrefix(pxToSpacingClass(ml.value, 'ml-'), deviceId))
      }

      if (mr === 'auto') {
        classes.push(addDevicePrefix('mr-auto', deviceId))
      } else if (typeof mr === 'object' && mr?.value !== undefined) {
        classes.push(addDevicePrefix(pxToSpacingClass(mr.value, 'mr-'), deviceId))
      }
    }

    if (typeof mt === 'object' && mt?.value !== undefined) {
      classes.push(addDevicePrefix(pxToSpacingClass(mt.value, 'mt-'), deviceId))
    }

    if (typeof mb === 'object' && mb?.value !== undefined) {
      classes.push(addDevicePrefix(pxToSpacingClass(mb.value, 'mb-'), deviceId))
    }
  }

  return classes
}

function processWidth(width: MakeswiftDeviceValue<MakeswiftSizeValue>[]): string[] {
  const classes: string[] = []

  for (const { deviceId, value } of width) {
    const { value: px, unit } = value

    if (unit === '%') {
      if (px === 100) {
        classes.push(addDevicePrefix('w-full', deviceId))
      } else if (px === 50) {
        classes.push(addDevicePrefix('w-1/2', deviceId))
      } else {
        classes.push(addDevicePrefix(`w-[${px}%]`, deviceId))
      }
    } else if (unit === 'px') {
      const scale = SPACING_PX_TO_TAILWIND[px]
      if (scale) {
        classes.push(addDevicePrefix(`w-${scale}`, deviceId))
      } else {
        classes.push(addDevicePrefix(`w-[${px}px]`, deviceId))
      }
    } else {
      classes.push(addDevicePrefix(`w-[${px}${unit}]`, deviceId))
    }
  }

  return classes
}

function processGap(
  gap: MakeswiftDeviceValue<MakeswiftSizeValue>[],
  direction: 'gap' | 'gap-x' | 'gap-y',
): string[] {
  const classes: string[] = []

  for (const { deviceId, value } of gap) {
    const { value: px } = value
    classes.push(addDevicePrefix(pxToSpacingClass(px, `${direction}-`), deviceId))
  }

  return classes
}

function processTypography(style: MakeswiftTypographyStyle, deviceId: string): string[] {
  const classes: string[] = []

  if (style.fontSize) {
    const px = style.fontSize.value
    const scale = FONT_SIZE_PX_TO_TAILWIND[px]
    if (scale) {
      classes.push(addDevicePrefix(`text-${scale}`, deviceId))
    } else {
      classes.push(addDevicePrefix(`text-[${px}px]`, deviceId))
    }
  }

  if (style.fontWeight) {
    const weight = FONT_WEIGHT_TO_TAILWIND[style.fontWeight]
    if (weight) {
      classes.push(addDevicePrefix(`font-${weight}`, deviceId))
    }
  }

  if (style.lineHeight) {
    const lh = LINE_HEIGHT_TO_TAILWIND[style.lineHeight]
    if (lh) {
      classes.push(addDevicePrefix(`leading-${lh}`, deviceId))
    }
  }

  return classes
}

function extractTextContent(richText: MakeswiftRichTextV2): { text: string; classes: string[] } {
  const classes: string[] = []
  let text = ''

  for (const descendant of richText.descendants) {
    if (descendant.textAlign) {
      for (const { deviceId, value } of descendant.textAlign) {
        classes.push(addDevicePrefix(`text-${value}`, deviceId))
      }
    }

    for (const child of descendant.children) {
      text += child.text

      if (child.typography?.style) {
        for (const { deviceId, value } of child.typography.style) {
          classes.push(...processTypography(value, deviceId))
        }
      }
    }
  }

  return { text, classes }
}

function processColumns(columns: MakeswiftDeviceValue<{ spans: number[][]; count: number }>[]): {
  isGrid: boolean
  gridClasses: string[]
  childWidths: Map<number, string[]>
} {
  const gridClasses: string[] = []
  const childWidths = new Map<number, string[]>()
  let isGrid = false

  for (const { deviceId, value } of columns) {
    const { spans, count } = value

    if (spans.length > 0 && spans[0].length > 1) {
      isGrid = true
      gridClasses.push(addDevicePrefix('grid', deviceId))
      gridClasses.push(addDevicePrefix(`grid-cols-${count}`, deviceId))

      let childIndex = 0
      for (const row of spans) {
        for (const span of row) {
          if (!childWidths.has(childIndex)) {
            childWidths.set(childIndex, [])
          }
          if (span !== count) {
            childWidths.get(childIndex)!.push(addDevicePrefix(`col-span-${span}`, deviceId))
          }
          childIndex++
        }
      }
    }
  }

  return { isGrid, gridClasses, childWidths }
}

function elementToJSX(
  element: MakeswiftElement,
  options: Required<RuntimeToJSXOptions>,
  depth: number = 0,
  colSpanClasses: string[] = [],
): { jsx: string; warnings: string[] } {
  const indent = options.indent.repeat(depth)
  const warnings: string[] = []

  const tagName = COMPONENT_TO_TAG[element.type] || 'div'
  const props = element.props

  const classes: string[] = [...colSpanClasses]

  if (props.padding) {
    classes.push(...processPadding(props.padding))
  }

  if (props.margin) {
    classes.push(...processMargin(props.margin))
  }

  if (props.width) {
    classes.push(...processWidth(props.width))
  }

  if (props.rowGap) {
    classes.push(...processGap(props.rowGap, 'gap-y'))
  }

  if (props.columnGap) {
    classes.push(...processGap(props.columnGap, 'gap-x'))
  }

  if (props.textStyle) {
    for (const { deviceId, value } of props.textStyle) {
      classes.push(...processTypography(value, deviceId))
    }
  }

  let textContent = ''
  if (props.text && typeof props.text === 'object' && props.text.type === 'makeswift::controls::rich-text-v2') {
    const { text, classes: textClasses } = extractTextContent(props.text)
    textContent = text
    classes.push(...textClasses)
  }

  if (typeof props.children === 'string') {
    textContent = props.children
  }

  const attrs: string[] = []

  if (classes.length > 0) {
    const uniqueClasses = [...new Set(classes)]
    attrs.push(`className="${uniqueClasses.join(' ')}"`)
  }

  if (props.image && tagName === 'img') {
    attrs.push(`src="${props.image}"`)
    if (props.alt) {
      attrs.push(`alt="${props.alt}"`)
    }
  }

  if (props.link && props.link.payload?.url) {
    attrs.push(`href="${props.link.payload.url}"`)
    if (props.link.payload.openInNewTab) {
      attrs.push('target="_blank"')
    }
  }

  if (options.includeKeys) {
    attrs.push(`data-key="${element.key}"`)
  }

  const attrString = attrs.length > 0 ? ' ' + attrs.join(' ') : ''

  if (tagName === 'img') {
    return { jsx: `${indent}<${tagName}${attrString} />`, warnings }
  }

  const children = props.children as MakeswiftChildren | undefined
  const hasChildren = children && typeof children === 'object' && children.elements && children.elements.length > 0

  if (!hasChildren && textContent) {
    return { jsx: `${indent}<${tagName}${attrString}>${textContent}</${tagName}>`, warnings }
  }

  if (!hasChildren && !textContent) {
    return { jsx: `${indent}<${tagName}${attrString} />`, warnings }
  }

  const childrenJSX: string[] = []

  if (hasChildren && children.columns) {
    const { isGrid, gridClasses, childWidths } = processColumns(children.columns)

    if (isGrid && gridClasses.length > 0) {
      const existingClassIndex = attrs.findIndex(a => a.startsWith('className='))
      if (existingClassIndex >= 0) {
        const existingClasses = attrs[existingClassIndex].match(/className="(.*)"/)?.[1] || ''
        attrs[existingClassIndex] = `className="${existingClasses} ${gridClasses.join(' ')}"`
      } else {
        attrs.push(`className="${gridClasses.join(' ')}"`)
      }
    }

    for (let i = 0; i < children.elements.length; i++) {
      const childElement = children.elements[i]
      const childColSpan = childWidths.get(i) || []
      const childResult = elementToJSX(childElement, options, depth + 1, childColSpan)
      childrenJSX.push(childResult.jsx)
      warnings.push(...childResult.warnings)
    }
  } else if (hasChildren) {
    for (const childElement of children.elements) {
      const childResult = elementToJSX(childElement, options, depth + 1)
      childrenJSX.push(childResult.jsx)
      warnings.push(...childResult.warnings)
    }
  }

  const finalAttrString = attrs.length > 0 ? ' ' + attrs.join(' ') : ''

  const jsx = [
    `${indent}<${tagName}${finalAttrString}>`,
    ...childrenJSX,
    `${indent}</${tagName}>`,
  ].join('\n')

  return { jsx, warnings }
}

function isMakeswiftRuntimeSchema(input: unknown): input is MakeswiftRuntimeSchema {
  if (!input || typeof input !== 'object') return false
  const obj = input as Record<string, unknown>
  return (
    typeof obj.key === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.props === 'object' &&
    obj.props !== null
  )
}

/**
 * Transforms a Makeswift runtime schema to JSX with Tailwind classes.
 *
 * This handles the actual Makeswift page data format (with component paths
 * like "./components/Box/index.js" and nested props structure).
 *
 * @param input - Makeswift runtime schema object or JSON string
 * @param options - Optional configuration
 * @returns RuntimeToJSXResult containing JSX and warnings
 *
 * @example
 * ```typescript
 * import { transformRuntimeToJSX } from '@makeswift/jsx-to-makeswift'
 *
 * const schema = {
 *   key: "abc123",
 *   type: "./components/Box/index.js",
 *   props: {
 *     padding: [{ deviceId: "desktop", value: { paddingTop: { value: 20, unit: "px" }, ... } }],
 *     children: { elements: [...] }
 *   }
 * }
 *
 * const result = transformRuntimeToJSX(schema)
 * console.log(result.jsx)
 * ```
 */
export function transformRuntimeToJSX(
  input: MakeswiftRuntimeSchema | string,
  options: Partial<RuntimeToJSXOptions> = {},
): RuntimeToJSXResult {
  const opts: Required<RuntimeToJSXOptions> = { ...DEFAULT_OPTIONS, ...options }

  try {
    const schema: MakeswiftRuntimeSchema = typeof input === 'string' ? JSON.parse(input) : input

    if (!isMakeswiftRuntimeSchema(schema)) {
      return {
        jsx: '',
        warnings: ['Invalid Makeswift runtime schema format'],
      }
    }

    return elementToJSX(schema, opts, 0)
  } catch (error) {
    return {
      jsx: '',
      warnings: [error instanceof Error ? error.message : String(error)],
    }
  }
}

/**
 * Checks if an object looks like a Makeswift runtime schema.
 */
export { isMakeswiftRuntimeSchema }
