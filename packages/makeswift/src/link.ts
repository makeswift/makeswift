import chalk from 'chalk'
import spawn from 'cross-spawn'
import * as fs from 'fs'
import detectPort from 'detect-port'
import MakeswiftError from './errors/MakeswiftError'
import { detectPackageManager, PM } from './utils/detect-package-manager'
import { performHandshake } from './utils/handshake'

const MAKESWIFT_APP_ORIGIN = process.env.MAKESWIFT_APP_ORIGIN || 'https://app.makeswift.com'

type LinkArgs = {
  template: string | undefined
}

export default async function wrappedLink(args: LinkArgs) {
  try {
    await link(args)
  } catch (err) {
    if (err instanceof MakeswiftError) {
      console.log(err.message)
      process.exit(0)
    } else {
      throw err
    }
  }
}

async function link({ template }: LinkArgs): Promise<void> {
  function validate() {
    // @note: leaving this as a placeholder for future validation
  }

  validate()

  const projectName = process.cwd().split('/').pop()

  if (!projectName) {
    throw new MakeswiftError('Unable to determine project name')
  }

  const nextAppPort = await detectPort(3000)
  const nextAppUrl = `http://localhost:${nextAppPort}`
  const redirectUrl = new URL(`${MAKESWIFT_APP_ORIGIN}/cli/link-site`)
  redirectUrl.searchParams.set('host_url', nextAppUrl)

  const { siteApiKey } = await performHandshake({
    projectName,
    template,
    redirectUrl,
  })

  let envLocal = ''

  try {
    envLocal = fs.readFileSync(`.env.local`, 'utf8')
  } catch (err) {}

  envLocal = 'MAKESWIFT_SITE_API_KEY=' + siteApiKey

  fs.writeFileSync(`.env.local`, envLocal)

  console.log(chalk.green('\n\nSite linked successfully!\n'))
  console.log(
    chalk.yellow(
      'MAKESWIFT_SITE_API_KEY saved to `.env.local`. Be sure to add this environment variable to your deployed environment.\n\n',
    ),
  )

  const packageManager = detectPackageManager()
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
  })
}
