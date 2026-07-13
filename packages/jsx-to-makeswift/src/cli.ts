/**
 * @fileoverview CLI tool for converting JSX with Tailwind to Makeswift control schemas.
 *
 * Usage:
 *   npx jsx-to-makeswift convert <file>           Convert JSX to schema
 *   npx jsx-to-makeswift reverse <file.json>      Convert schema back to JSX
 *   npx jsx-to-makeswift convert --stdin          Read JSX from stdin
 *   npx jsx-to-makeswift reverse --stdin          Read JSON schema from stdin
 *
 * Options:
 *   --help, -h     Show help message
 *   --version, -v  Show version number
 *   --stdin        Read input from stdin instead of files
 *   --pretty       Pretty-print output (default: true)
 *   --compact      Compact output (no indentation)
 *   --fragment     Treat input as JSX fragment (multiple root elements)
 *
 * Exit codes:
 *   0  Success
 *   1  Error (parse error, file not found, etc.)
 *
 * @module @makeswift/jsx-to-makeswift/cli
 */

import * as fs from 'fs'
import * as path from 'path'

import { isMakeswiftRuntimeSchema, transformRuntimeToJSX } from './makeswift-runtime/runtime-to-jsx'
import { transformSchemaToJSX } from './reverse/schema-to-jsx'
import { transformJSX, type TransformJSXOptions } from './transform'

type Command = 'convert' | 'reverse' | null

type CLIOptions = {
  command: Command
  stdin: boolean
  pretty: boolean
  fragment: boolean
  help: boolean
  version: boolean
  files: string[]
}

const VERSION = '0.0.1'

const HELP_TEXT = `
jsx-to-makeswift - Bidirectional conversion between JSX+Tailwind and Makeswift control schemas

COMMANDS:
  convert <file>     Convert JSX with Tailwind to Makeswift control schema (JSON)
  reverse <file>     Convert Makeswift control schema (JSON) back to JSX with Tailwind

USAGE:
  npx jsx-to-makeswift convert <file>            Convert JSX file to schema
  npx jsx-to-makeswift convert <file1> <file2>   Convert multiple JSX files
  npx jsx-to-makeswift convert --stdin           Read JSX from stdin
  npx jsx-to-makeswift reverse <file.json>       Convert JSON schema to JSX
  npx jsx-to-makeswift reverse --stdin           Read JSON schema from stdin

OPTIONS:
  --help, -h      Show this help message
  --version, -v   Show version number
  --stdin         Read input from stdin instead of files
  --pretty        Pretty-print output (default)
  --compact       Compact output (no indentation)
  --fragment      Treat JSX input as fragment (multiple root elements)

EXAMPLES:
  # Convert JSX to schema
  npx jsx-to-makeswift convert src/components/Hero.tsx

  # Convert schema back to JSX
  npx jsx-to-makeswift reverse schema.json

  # Round-trip: JSX → Schema → JSX
  npx jsx-to-makeswift convert --stdin < Hero.jsx | npx jsx-to-makeswift reverse --stdin

  # Pipe JSX and get schema
  echo '<div className="p-4 bg-blue-500">Hello</div>' | npx jsx-to-makeswift convert --stdin

  # Pipe schema and get JSX
  echo '{"type":"Container","tagName":"div","controls":{"style":{"type":"Style","properties":["padding"],"value":[{"deviceId":"mobile","value":{"padding":"1rem"}}]}}}' | npx jsx-to-makeswift reverse --stdin

EXIT CODES:
  0  Success
  1  Error (parse error, file not found, etc.)
`

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    command: null,
    stdin: false,
    pretty: true,
    fragment: false,
    help: false,
    version: false,
    files: [],
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true
        break
      case '--version':
      case '-v':
        options.version = true
        break
      case '--stdin':
        options.stdin = true
        break
      case '--pretty':
        options.pretty = true
        break
      case '--compact':
        options.pretty = false
        break
      case '--fragment':
        options.fragment = true
        break
      case 'convert':
        options.command = 'convert'
        break
      case 'reverse':
        options.command = 'reverse'
        break
      default:
        if (!arg.startsWith('-')) {
          options.files.push(arg)
        }
    }
  }

  return options
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''

    process.stdin.setEncoding('utf8')

    process.stdin.on('data', (chunk) => {
      data += chunk
    })

    process.stdin.on('end', () => {
      resolve(data)
    })

    process.stdin.on('error', (err) => {
      reject(err)
    })

    if (process.stdin.isTTY) {
      resolve('')
    }
  })
}

function readFile(filePath: string): string {
  const absolutePath = path.resolve(process.cwd(), filePath)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  return fs.readFileSync(absolutePath, 'utf8')
}

type CommandResult = {
  success: boolean
  file?: string
  output?: unknown
  error?: string
}

function convertJSXToSchema(
  source: string,
  options: Partial<TransformJSXOptions>,
  file?: string,
): CommandResult {
  const result = transformJSX(source, options)

  if (result.errors.length > 0) {
    return {
      success: false,
      file,
      error: result.errors.join('\n'),
    }
  }

  const output = result.schemas.length === 1 ? result.schemas[0] : result.schemas

  return {
    success: true,
    file,
    output,
  }
}

function convertSchemaToJSX(
  source: string,
  file?: string,
): CommandResult {
  try {
    const parsed = JSON.parse(source)

    if (isMakeswiftRuntimeSchema(parsed)) {
      const result = transformRuntimeToJSX(parsed)

      if (result.warnings.length > 0 && !result.jsx) {
        return {
          success: false,
          file,
          error: result.warnings.join('\n'),
        }
      }

      return {
        success: true,
        file,
        output: result.jsx,
      }
    }

    const result = transformSchemaToJSX(parsed)

    if (result.warnings.length > 0 && !result.jsx) {
      return {
        success: false,
        file,
        error: result.warnings.join('\n'),
      }
    }

    return {
      success: true,
      file,
      output: result.jsx,
    }
  } catch (err) {
    return {
      success: false,
      file,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

function formatConvertOutput(results: CommandResult[], pretty: boolean): string {
  if (results.length === 1) {
    const result = results[0]

    if (!result.success) {
      return JSON.stringify({ error: result.error }, null, pretty ? 2 : undefined)
    }

    return JSON.stringify(result.output, null, pretty ? 2 : undefined)
  }

  const output = results.map((result) => {
    if (!result.success) {
      return { file: result.file, error: result.error }
    }
    return { file: result.file, schema: result.output }
  })

  return JSON.stringify(output, null, pretty ? 2 : undefined)
}

function formatReverseOutput(results: CommandResult[]): string {
  if (results.length === 1) {
    const result = results[0]

    if (!result.success) {
      return `// Error: ${result.error}`
    }

    return result.output as string
  }

  return results
    .map((result) => {
      if (!result.success) {
        return `// File: ${result.file}\n// Error: ${result.error}`
      }
      return `// File: ${result.file}\n${result.output}`
    })
    .join('\n\n')
}

async function runConvert(options: CLIOptions): Promise<number> {
  const transformOptions: Partial<TransformJSXOptions> = {
    fragment: options.fragment,
  }

  const results: CommandResult[] = []

  if (options.stdin) {
    const source = await readStdin()

    if (!source.trim()) {
      console.error('Error: No input received from stdin')
      return 1
    }

    results.push(convertJSXToSchema(source, transformOptions, 'stdin'))
  } else if (options.files.length > 0) {
    for (const file of options.files) {
      try {
        const source = readFile(file)
        results.push(convertJSXToSchema(source, transformOptions, file))
      } catch (err) {
        results.push({
          success: false,
          file,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }
  } else {
    console.error('Error: No input provided. Use --stdin or provide file paths.')
    console.error('Run with --help for usage information.')
    return 1
  }

  const output = formatConvertOutput(results, options.pretty)
  console.log(output)

  const hasErrors = results.some((r) => !r.success)
  return hasErrors ? 1 : 0
}

async function runReverse(options: CLIOptions): Promise<number> {
  const results: CommandResult[] = []

  if (options.stdin) {
    const source = await readStdin()

    if (!source.trim()) {
      console.error('Error: No input received from stdin')
      return 1
    }

    results.push(convertSchemaToJSX(source, 'stdin'))
  } else if (options.files.length > 0) {
    for (const file of options.files) {
      try {
        const source = readFile(file)
        results.push(convertSchemaToJSX(source, file))
      } catch (err) {
        results.push({
          success: false,
          file,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }
  } else {
    console.error('Error: No input provided. Use --stdin or provide file paths.')
    console.error('Run with --help for usage information.')
    return 1
  }

  const output = formatReverseOutput(results)
  console.log(output)

  const hasErrors = results.some((r) => !r.success)
  return hasErrors ? 1 : 0
}

async function main(): Promise<number> {
  const args = process.argv.slice(2)
  const options = parseArgs(args)

  if (options.help) {
    console.log(HELP_TEXT)
    return 0
  }

  if (options.version) {
    console.log(VERSION)
    return 0
  }

  if (!options.command) {
    console.error('Error: No command specified. Use "convert" or "reverse".')
    console.error('Run with --help for usage information.')
    return 1
  }

  if (options.command === 'convert') {
    return runConvert(options)
  }

  if (options.command === 'reverse') {
    return runReverse(options)
  }

  return 1
}

main()
  .then((exitCode) => {
    process.exit(exitCode)
  })
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
