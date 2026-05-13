// Shared serializer for log payload arguments. Used by both the client-side
// `client-log-relay` (browser → parent window) and the server-side
// `server-log-relay` (Node → SSE → parent window). Pure module, no DOM
// dependency, safe to import from any runtime.

// Cap individual serialized values to avoid pinning huge objects in
// transferred messages (e.g. logging an entire React tree).
export const MAX_STRING_LENGTH = 10_000

// Strip ANSI escape sequences (color/style + cursor-movement). Next.js's dev
// logger writes colored access lines and pretty error frames to stdout/stderr
// using ANSI codes; without stripping, captured payloads contain literal
// `\x1b[32m200\x1b[39m`-style text. Pattern matches CSI sequences (the most
// common form by far) and OSC sequences terminated by BEL or ST.
//
// eslint-disable-next-line no-control-regex
const ANSI_REGEX = /\x1b(?:\[[0-9;?]*[a-zA-Z]|\][^\x07\x1b]*(?:\x07|\x1b\\))/g

export function stripAnsi(value: string): string {
  return value.replace(ANSI_REGEX, '')
}

/**
 * Resolve printf-style `%c`-bearing console format strings into a clean,
 * single-arg result. This is specifically for console invocations like the
 * one Next.js's RSC console replay produces:
 *
 *   console.error('%c%s%c %s', '<css>', 'Server', '<css2>', 'actual message')
 *
 * which would otherwise reach the builder as five separate args including
 * raw CSS rule strings. After this pass, the equivalent capture becomes a
 * single resolved string `'Server actual message'`.
 *
 * Only runs when the format string contains `%c` — leaves untouched any
 * normal log call (`console.log('foo', 'bar')` or `console.log('x: %s', y)`),
 * since those don't carry CSS noise and the builder/devtools are expected
 * to handle `%s`/`%d`/etc. themselves.
 */
export function formatConsoleArgs(args: unknown[]): unknown[] {
  if (args.length === 0) return args
  const format = args[0]
  if (typeof format !== 'string' || !format.includes('%c')) return args

  let result = ''
  let i = 0
  let argIndex = 1

  while (i < format.length) {
    const ch = format[i]
    if (ch !== '%' || i === format.length - 1) {
      result += ch
      i++
      continue
    }
    const spec = format[i + 1]
    if (spec === '%') {
      result += '%'
      i += 2
      continue
    }
    if (argIndex >= args.length) {
      // Missing arg for the directive — leave the literal text in place.
      result += '%' + spec
      i += 2
      continue
    }
    switch (spec) {
      case 'c':
        // CSS styling directive — drop the corresponding arg, emit nothing.
        argIndex++
        break
      case 's':
        result += stringifyForFormat(args[argIndex++])
        break
      case 'd':
      case 'i': {
        const n = parseInt(stringifyForFormat(args[argIndex++]), 10)
        result += Number.isNaN(n) ? 'NaN' : String(n)
        break
      }
      case 'f': {
        const n = parseFloat(stringifyForFormat(args[argIndex++]))
        result += Number.isNaN(n) ? 'NaN' : String(n)
        break
      }
      case 'o':
      case 'O':
        result += stringifyForFormat(args[argIndex++])
        break
      default:
        result += '%' + spec
        argIndex++
    }
    i += 2
  }

  return [result, ...args.slice(argIndex)]
}

function stringifyForFormat(value: unknown): string {
  if (value == null) return String(value)
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
}

export function serializeArg(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      __type: 'Error',
      name: value.name,
      message: stripAnsi(value.message),
      stack: value.stack != null ? stripAnsi(value.stack) : value.stack,
    }
  }

  switch (typeof value) {
    case 'string': {
      const stripped = stripAnsi(value)
      return stripped.length > MAX_STRING_LENGTH ? stripped.slice(0, MAX_STRING_LENGTH) + '…' : stripped
    }
    case 'number':
    case 'boolean':
    case 'undefined':
      return value
    case 'bigint':
      return `${value.toString()}n`
    case 'symbol':
      return value.toString()
    case 'function':
      return `[Function${value.name ? `: ${value.name}` : ''}]`
    case 'object': {
      if (value === null) return null
      try {
        const seen = new WeakSet<object>()
        const serialized = JSON.stringify(value, (_key, v) => {
          if (typeof v === 'bigint') return `${v.toString()}n`
          if (typeof v === 'function') return `[Function${v.name ? `: ${v.name}` : ''}]`
          if (typeof v === 'object' && v !== null) {
            if (seen.has(v)) return '[Circular]'
            seen.add(v)
          }
          return v
        })
        if (serialized == null) return String(value)
        return serialized.length > MAX_STRING_LENGTH
          ? serialized.slice(0, MAX_STRING_LENGTH) + '…'
          : serialized
      } catch {
        try {
          return String(value)
        } catch {
          return '[Unserializable]'
        }
      }
    }
    default:
      return String(value)
  }
}
