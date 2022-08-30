import spawn from 'cross-spawn'
import { coerceExampleToUrl } from './utils/coerce-example-to-URL'

export function createNextApp({ dir, example }: { dir: string; example: string }): void {
  const url = coerceExampleToUrl(example)

  spawn.sync('npx', ['--yes', 'create-next-app', '--example', url, dir], {
    stdio: 'inherit',
    cwd: __dirname,
  })
}
