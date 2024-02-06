import spawn from 'cross-spawn'
import MakeswiftError from './errors/MakeswiftError'
import { coerceExampleToUrl } from './utils/coerce-example-to-URL'

export function createNextApp({
  dir,
  example,
  useNpm,
  usePnpm,
}: {
  dir: string
  example: string
  useNpm: boolean
  usePnpm: boolean
}): void {
  const url = coerceExampleToUrl(example)
  const npxArgs = ['--yes', 'create-next-app@latest', '--example', url, dir]

  if (useNpm) {
    npxArgs.push('--use-npm')
  }
  if (usePnpm) {
    npxArgs.push('--use-pnpm')
  }

  const output = spawn.sync('npx', npxArgs, {
    stdio: 'inherit',
  })

  if (output.status === 1) {
    throw new MakeswiftError('Unable to create a Next.js app. There should be output above.')
  }
}
