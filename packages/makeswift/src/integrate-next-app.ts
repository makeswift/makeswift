import spawn from 'cross-spawn'
import { yarnOrNpm } from './utils/yarn-or-npm'

export function integrateNextApp({ dir }: { dir: string }): void {
  console.log('Integrating Next.js app')

  // Step 1 - install the runtime
  installMakeswiftRuntime({ dir })
}

function installMakeswiftRuntime({ dir }: { dir: string }): void {
  const packageManager = yarnOrNpm(dir)
  if (packageManager === 'npm') {
    spawn.sync('npm', ['install', '@makeswift/runtime'], {
      stdio: 'inherit',
      cwd: dir,
    })
  } else if (packageManager === 'yarn') {
    spawn.sync('yarn', ['add', '@makeswift/runtime'], {
      stdio: 'inherit',
      cwd: dir,
    })
  }
}
