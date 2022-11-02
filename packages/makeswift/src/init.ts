import chalk from 'chalk'
import spawn from 'cross-spawn'
import detect from 'detect-port'
import * as fs from 'fs'
import * as http from 'http'
import open from 'open'
import { createNextApp } from './create-next-app'
import MakeswiftError from './errors/MakeswiftError'
import { integrateNextApp } from './integrate-next-app'
import { checkForConflictingFiles } from './utils/check-for-conflicting-files'
import { getProjectName } from './utils/get-name'
import isNextApp from './utils/is-next-app'
import { Socket } from 'node:net'

const MAKESWIFT_APP_ORIGIN = process.env.MAKESWIFT_APP_ORIGIN || 'https://app.makeswift.com'
const MAKESWIFT_API_ORIGIN = process.env.MAKESWIFT_API_ORIGIN
const siteSelectionPath = 'select-site'

type InitArgs = { example: string | undefined; useNpm: boolean; usePnpm: boolean; env: string[] }

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
  { example: passedInExample, useNpm, usePnpm, env }: InitArgs,
): Promise<void> {
  function validate() {
    if (useNpm && usePnpm) {
      throw new MakeswiftError(
        'Cannot use both --use-npm and --use-pnpm args. Choose 1 package manager.',
      )
    }
  }

  async function performHandshake({
    usingExistingNextApp,
  }: {
    usingExistingNextApp: boolean
  }): Promise<{ nextAppPort: number; envLocal: string; example: string | null }> {
    const handshakePort = await detect(5600)
    const nextAppPort = await detect(3000)

    const callbackUrl = `http://localhost:${handshakePort}/${siteSelectionPath}`
    // Handshake Step 1
    const selectSiteUrl = new URL(`${MAKESWIFT_APP_ORIGIN}/cli/select-site`)
    selectSiteUrl.searchParams.set('project_name', projectName)
    selectSiteUrl.searchParams.set('callback_url', callbackUrl)
    selectSiteUrl.searchParams.set('using_existing_next_app', String(usingExistingNextApp))
    passedInExample && selectSiteUrl.searchParams.set('example', passedInExample)

    const selectSiteUrlString = selectSiteUrl.toString()
    console.log(
      `\nOpening your browser at ${chalk.blue(
        selectSiteUrlString,
      )}\n\nIf anything happens, re-open that URL.`,
    )
    await open(selectSiteUrlString)

    // Handshake Step 2 - the browser goes to `callbackUrl`
    const nextAppUrl = `http://localhost:${nextAppPort}`
    const redirectUrl = new URL(`${MAKESWIFT_APP_ORIGIN}/cli/link-site`)
    redirectUrl.searchParams.set('host_url', nextAppUrl)

    // Handshake Step 3 - we redirect the browser to redirectUrl
    const { siteApiKey, example } = await getSiteMetadata({
      port: handshakePort,
      redirectUrl: redirectUrl.toString(),
    })

    // In the background, we're setting up the Next app with the API key
    // and starting the app at `nextAppPort`
    const envLocal = buildLocalEnvFile(
      {
        MAKESWIFT_SITE_API_KEY: siteApiKey,
        MAKESWIFT_API_ORIGIN,
      },
      env,
    )

    // Handshake Step 4 - Makeswift redirects to the builder with the site open,
    //                    with the host using `nextAppUrl` for the builder

    return { nextAppPort, envLocal, example: example || passedInExample || null }
  }

  validate()

  const { directory: nextAppDir, name: projectName } = await getProjectName(name)
  const usingExistingNextApp = isNextApp(nextAppDir)

  checkForConflictingFiles({ dir: nextAppDir })

  const { nextAppPort, envLocal, example } = await performHandshake({ usingExistingNextApp })

  if (usingExistingNextApp) {
    await integrateNextApp({ dir: nextAppDir })
  } else {
    createNextApp({
      dir: nextAppDir,
      example: example || 'basic-typescript',
      useNpm,
      usePnpm,
    })
  }

  fs.writeFileSync(`${nextAppDir}/.env.local`, envLocal)

  spawn.sync('yarn', ['dev', '--port', nextAppPort.toString()], {
    stdio: 'inherit',
    cwd: nextAppDir,
  })
}

async function getSiteMetadata({
  port,
  redirectUrl,
}: {
  port: number
  redirectUrl: string
}): Promise<{ siteApiKey: string; example: string | null }> {
  return new Promise<{ siteApiKey: string; example: string | null }>((resolve, reject) => {
    const sockets: Socket[] = []
    const server = http
      .createServer((req, res) => {
        const url = new URL(req.url!, `http://${req.headers.host}`)
        if (url.pathname !== `/${siteSelectionPath}`) {
          res.writeHead(400)
          res.end()
          return
        }

        const queryParams = url.searchParams
        const siteApiKey = queryParams.get('site_api_key')
        if (!siteApiKey) {
          res.writeHead(400)
          res.end()
          return
        }

        const example = queryParams.get('example')

        // add the api key in the redirect URL
        const destinationURL = new URL(redirectUrl)
        destinationURL.searchParams.set('api_key', siteApiKey)
        res.writeHead(302, {
          Location: destinationURL.toString(),
        })
        res.end(() => {
          server.close(err => {
            if (err != null) {
              reject(err)
            }
            resolve({
              siteApiKey,
              example,
            })
          })

          // Google Chrome very aggressively holds on to the socket
          for (const socket of sockets) {
            if (!socket.destroyed) {
              socket.destroy()
            }
          }
        })
      })
      .listen(port)

    server.on('connection', function (socket: Socket) {
      sockets.push(socket)
    })
  })
}

function buildLocalEnvFile(
  variables: { [key: string]: string | undefined },
  predefinedValues?: string[],
): string {
  const envFile = Object.entries(variables)
    .filter(([key, value]) => value != null)
    .reduce((envFile, [key, value]) => {
      return envFile + `${key}=${value}\n`
    }, '')

  if (predefinedValues != null) {
    return envFile + predefinedValues.join('\n')
  }

  return envFile
}
