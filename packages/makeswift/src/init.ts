import spawn from 'cross-spawn'
import detect from 'detect-port'
import * as fs from 'fs'
import * as http from 'http'
import inquirer from 'inquirer'
import open from 'open'
import * as path from 'path'
import { createNextApp } from './create-next-app'
import { integrateNextApp } from './integrate-next-app'
import { getProjectName } from './utils/get-name'
import isNextApp from './utils/is-next-app'

const MAKESWIFT_APP_ORIGIN = process.env.MAKESWIFT_APP_ORIGIN || 'https://app.makeswift.com'
const siteSelectionPath = 'select-site'

async function init(
  name: string | undefined,
  { example = 'basic-typescript' }: { example?: string },
): Promise<void> {
  const projectName = name || (await getProjectName())
  const nextAppDir = path.join(process.cwd(), projectName)

  if (isNextApp(nextAppDir)) {
    integrateNextApp({ dir: nextAppDir })
  } else {
    createNextApp({
      dir: nextAppDir,
      example,
    })
  }

  const handshakePort = await detect(5600)
  const nextAppPort = await detect(3000)

  const callbackUrl = `http://localhost:${handshakePort}/${siteSelectionPath}`
  // Handshake Step 1
  const selectSiteUrl = new URL(`${MAKESWIFT_APP_ORIGIN}/cli/select-site`)
  selectSiteUrl.searchParams.set('project_name', projectName)
  selectSiteUrl.searchParams.set('callback_url', callbackUrl)
  await open(selectSiteUrl.toString())

  // Handshake Step 2 - the browser goes to `callbackUrl`
  const nextAppUrl = `http://localhost:${nextAppPort}/makeswift`
  const redirectUrl = new URL(`${MAKESWIFT_APP_ORIGIN}/cli/link-site`)
  redirectUrl.searchParams.set('host_url', nextAppUrl)

  // Handshake Step 3 - we redirect the browser to redirectUrl
  const { siteApiKey } = await getSiteApiKey({
    port: handshakePort,
    redirectUrl: redirectUrl.toString(),
  })

  // In the background, we're setting up the Next app with the API key
  // and starting the app at `nextAppPort`
  const envLocal = `MAKESWIFT_SITE_API_KEY=${siteApiKey}\n`
  fs.writeFileSync(`${nextAppDir}/.env.local`, envLocal)

  spawn.sync('yarn', ['dev', '--port', nextAppPort.toString()], {
    stdio: 'inherit',
    cwd: nextAppDir,
  })

  // Handshake Step 4 - Makeswift redirects to the builder with the site open,
  //                    with the host using `nextAppUrl` for the builder
}

async function getSiteApiKey({
  port,
  redirectUrl,
}: {
  port: number
  redirectUrl: string
}): Promise<{ siteApiKey: string }> {
  return new Promise<{ siteApiKey: string }>((resolve, reject) => {
    const server = http
      .createServer((req, res) => {
        const url = new URL(req.url!, `http://${req.headers.host}`)
        if (url.pathname !== `/${siteSelectionPath}`) {
          reject(new Error('The CLI does not know how to handle that path.'))
          return
        }

        const queryParams = url.searchParams
        const siteApiKey = queryParams.get('site_api_key')
        if (!siteApiKey) {
          reject(new Error('Select site redirect URL does not contain Site API Key.'))
          return
        }

        // add the api key in the redirect URL
        const destinationURL = new URL(redirectUrl)
        destinationURL.searchParams.set('api_key', siteApiKey)
        res.writeHead(302, {
          Location: destinationURL.toString(),
        })
        res.end()
        server.close()

        resolve({
          siteApiKey,
        })
      })
      .listen(port)
  })
}

export default init
