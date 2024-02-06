import spawn from 'cross-spawn'
import MakeswiftError from './errors/MakeswiftError'
import { coerceExampleToUrl } from './utils/coerce-example-to-URL'

export function createNextApp({
  dir,
  example,
  useNpm,
  useYarn,
  usePnpm,
  useBun,
}: {
  dir: string
  example: string
  useNpm: boolean
  useYarn: boolean
  usePnpm: boolean
  useBun: boolean
}): void {
  const url = coerceExampleToUrl(example)
  const npxArgs = ['--yes', 'create-next-app@latest', '--example', url, dir]

  if (useNpm) {
    npxArgs.push('--use-npm')
  }
  if (useYarn) {
    npxArgs.push('--use-yarn')
  }
  if (usePnpm) {
    npxArgs.push('--use-pnpm')
  }
  if (useBun) {
    npxArgs.push('--use-bun')
  }

  const output = spawn.sync('npx', npxArgs, {
    stdio: 'inherit',
  })

  if (output.status === 1) {
    throw new MakeswiftError('Unable to create a Next.js app. There should be output above.')
  }
}
