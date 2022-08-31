import spawn from 'cross-spawn'
import { coerceExampleToUrl } from './utils/coerce-example-to-URL'

export function createNextApp({ dir, example }: { dir: string; example: string }): void {
  const url = coerceExampleToUrl(example)

  const output = spawn.sync('npx', ['--yes', 'create-next-app', '--example', url, dir], {
    stdio: 'inherit',
  })

  if (output.status === 1) {
    throw Error('Unable to create a Next.js app. There should be output above.')
  }
}
