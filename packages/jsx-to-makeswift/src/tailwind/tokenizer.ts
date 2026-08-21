import type {
  DeviceId,
  TailwindClassToken,
  TailwindParseResult,
} from '../types'

const RESPONSIVE_PREFIXES: Record<string, DeviceId> = {
  sm: 'tablet',
  md: 'desktop',
  lg: 'desktop',
  xl: 'desktop',
  '2xl': 'desktop',
}

const STATE_VARIANTS = [
  'hover',
  'focus',
  'active',
  'disabled',
  'visited',
  'focus-within',
  'focus-visible',
  'first',
  'last',
  'odd',
  'even',
  'group-hover',
  'group-focus',
  'peer-hover',
  'peer-focus',
]

const ARBITRARY_VALUE_PATTERN = /^(.+)-\[(.+)\]$/
const NEGATIVE_PREFIX_PATTERN = /^-(.+)$/

const SINGLE_PART_UTILITIES = [
  'bg',
  'text',
  'border',
  'ring',
  'divide',
  'placeholder',
  'caret',
  'accent',
  'fill',
  'stroke',
  'from',
  'via',
  'to',
  'shadow',
  'opacity',
  'font',
  'leading',
  'tracking',
  'rounded',
  'outline',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'ms',
  'me',
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'ps',
  'pe',
  'w',
  'h',
  'min-w',
  'max-w',
  'min-h',
  'max-h',
  'size',
  'gap',
  'gap-x',
  'gap-y',
  'space-x',
  'space-y',
  'inset',
  'inset-x',
  'inset-y',
  'top',
  'right',
  'bottom',
  'left',
  'start',
  'end',
  'z',
  'order',
  'basis',
  'grow',
  'shrink',
  'columns',
  'aspect',
  'scale',
  'rotate',
  'translate-x',
  'translate-y',
  'skew-x',
  'skew-y',
  'origin',
  'delay',
  'duration',
  'ease',
  'blur',
  'brightness',
  'contrast',
  'grayscale',
  'hue-rotate',
  'invert',
  'saturate',
  'sepia',
  'backdrop-blur',
  'backdrop-brightness',
  'backdrop-contrast',
  'backdrop-grayscale',
  'backdrop-hue-rotate',
  'backdrop-invert',
  'backdrop-opacity',
  'backdrop-saturate',
  'backdrop-sepia',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-x',
  'border-y',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',
  'rounded-tl',
  'rounded-tr',
  'rounded-br',
  'rounded-bl',
  'rounded-s',
  'rounded-e',
  'rounded-ss',
  'rounded-se',
  'rounded-ee',
  'rounded-es',
].sort((a, b) => b.length - a.length)

type ParsedClass = {
  prefix: string | null
  variant: string | null
  utility: string
  value: string | null
  isArbitrary: boolean
  isNegative: boolean
}

function parseUtilityAndValue(
  utilityPart: string,
): Pick<ParsedClass, 'utility' | 'value' | 'isArbitrary' | 'isNegative'> {
  let isNegative = false
  let workingPart = utilityPart

  const negativeMatch = workingPart.match(NEGATIVE_PREFIX_PATTERN)
  if (negativeMatch) {
    isNegative = true
    workingPart = negativeMatch[1]
  }

  const arbitraryMatch = workingPart.match(ARBITRARY_VALUE_PATTERN)
  if (arbitraryMatch) {
    return {
      utility: arbitraryMatch[1],
      value: arbitraryMatch[2],
      isArbitrary: true,
      isNegative,
    }
  }

  for (const utility of SINGLE_PART_UTILITIES) {
    if (workingPart === utility) {
      return {
        utility: workingPart,
        value: null,
        isArbitrary: false,
        isNegative,
      }
    }

    if (workingPart.startsWith(`${utility}-`)) {
      return {
        utility,
        value: workingPart.substring(utility.length + 1),
        isArbitrary: false,
        isNegative,
      }
    }
  }

  return {
    utility: workingPart,
    value: null,
    isArbitrary: false,
    isNegative,
  }
}

function tokenizeClass(className: string): TailwindClassToken {
  const parts = className.split(':')

  let prefix: string | null = null
  let variant: string | null = null
  let utilityPart: string

  if (parts.length === 1) {
    utilityPart = parts[0]
  } else if (parts.length === 2) {
    const firstPart = parts[0]

    if (RESPONSIVE_PREFIXES[firstPart]) {
      prefix = firstPart
    } else if (STATE_VARIANTS.includes(firstPart)) {
      variant = firstPart
    } else {
      prefix = firstPart
    }

    utilityPart = parts[1]
  } else {
    prefix = parts[0]
    variant = parts.slice(1, -1).join(':')
    utilityPart = parts[parts.length - 1]
  }

  const { utility, value, isArbitrary, isNegative } =
    parseUtilityAndValue(utilityPart)

  return {
    raw: className,
    prefix,
    variant,
    utility,
    value,
    isArbitrary,
    isNegative,
  }
}

export function tokenizeTailwindClasses(
  classString: string | null,
): TailwindParseResult {
  const result: TailwindParseResult = {
    baseClasses: [],
    responsiveClasses: {
      mobile: [],
      tablet: [],
      desktop: [],
    },
    stateClasses: {},
  }

  if (!classString) {
    return result
  }

  const classes = classString.split(/\s+/).filter(Boolean)

  for (const cls of classes) {
    const token = tokenizeClass(cls)

    if (token.variant) {
      if (!result.stateClasses[token.variant]) {
        result.stateClasses[token.variant] = []
      }
      result.stateClasses[token.variant].push(token)
    } else if (token.prefix && RESPONSIVE_PREFIXES[token.prefix]) {
      const deviceId = RESPONSIVE_PREFIXES[token.prefix]
      result.responsiveClasses[deviceId].push(token)
    } else {
      result.baseClasses.push(token)
    }
  }

  return result
}

export function getTokensByUtility(
  tokens: TailwindClassToken[],
  utilityPrefix: string,
): TailwindClassToken[] {
  return tokens.filter(
    (token) =>
      token.utility === utilityPrefix ||
      token.utility.startsWith(`${utilityPrefix}-`),
  )
}

export function findToken(
  tokens: TailwindClassToken[],
  utility: string,
): TailwindClassToken | undefined {
  return tokens.find((token) => token.utility === utility)
}

export function hasUtility(
  tokens: TailwindClassToken[],
  utility: string,
): boolean {
  return tokens.some(
    (token) =>
      token.utility === utility || token.utility.startsWith(`${utility}-`),
  )
}
