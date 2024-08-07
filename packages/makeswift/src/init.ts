import chalk from 'chalk'
import spawn from 'cross-spawn'
import * as fs from 'fs'
import detectPort from 'detect-port'
import { createNextApp } from './create-next-app'
import MakeswiftError from './errors/MakeswiftError'
import { getProjectName } from './utils/get-name'
import { detectPackageManager, PM } from './utils/detect-package-manager'
import { performHandshake } from './utils/handshake'

const MAKESWIFT_APP_ORIGIN = process.env.MAKESWIFT_APP_ORIGIN || 'https://app.makeswift.com'

type InitArgs = {
  example: string | undefined
  template: string | undefined
  useNpm: boolean
  useYarn: boolean
  usePnpm: boolean
  useBun: boolean
  env: string[]
}

export default async function wrappedInit(name: string | undefined, args: InitArgs) {
  try {
    await init(name, args)
  } catch (err) {
    if (err instanceof MakeswiftError) {
      console.log(err.message)
      process.exit(0)
    } else {
      throw err
    }
  }
}

async function init(
  name: string | undefined,
  { example: passedInExample, template, useNpm, useYarn, usePnpm, useBun, env = [] }: InitArgs,
): Promise<void> {
  function validate() {
    if (useNpm && useYarn && usePnpm && useBun) {
      throw new MakeswiftError(
        'Cannot specify multiple --use-*** commands. Choose 1 package manager.',
      )
    }
  }

  validate()

  const { directory: nextAppDir, name: projectName } = await getProjectName(name)

  const nextAppPort = await detectPort(3000)
  const nextAppUrl = `http://localhost:${nextAppPort}`
  const redirectUrl = new URL(`${MAKESWIFT_APP_ORIGIN}/cli/link-site`)
  redirectUrl.searchParams.set('host_url', nextAppUrl)

  const { envLocal, example } = await performHandshake({
    projectName,
    passedInExample,
    template,
    env,
    redirectUrl,
  })

  createNextApp({
    dir: nextAppDir,
    example: example || 'basic-typescript',
    useNpm,
    useYarn,
    usePnpm,
    useBun,
  })

  fs.writeFileSync(`${nextAppDir}/.env.local`, envLocal)

  let packageManager: PM
  if (useNpm) packageManager = 'npm'
  else if (useYarn) packageManager = 'yarn'
  else if (usePnpm) packageManager = 'pnpm'
  else packageManager = detectPackageManager()

  let spawnArgs
  switch (packageManager) {
    case 'npm':
      spawnArgs = ['run', 'dev', '--', '--port', nextAppPort.toString()]
      break

    case 'bun':
    case 'yarn':
    case 'pnpm':
      spawnArgs = ['run', 'dev', '--port', nextAppPort.toString()]
      break
  }

  spawn.sync(packageManager, spawnArgs, {
    stdio: 'inherit',
    cwd: nextAppDir,
  })
}
