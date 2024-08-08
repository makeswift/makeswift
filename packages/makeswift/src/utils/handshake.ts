import chalk from 'chalk'
import detectPort from 'detect-port'
import * as http from 'http'
import open from 'open'
import { Socket } from 'node:net'

const MAKESWIFT_APP_ORIGIN = process.env.MAKESWIFT_APP_ORIGIN || 'https://app.makeswift.com'
const MAKESWIFT_API_ORIGIN = process.env.MAKESWIFT_API_ORIGIN
const siteSelectionPath = 'select-site'

export async function performHandshake({
  projectName,
  passedInExample,
  template,
  env = [],
  redirectUrl,
}: {
  projectName: string
  passedInExample?: string
  template?: string
  env?: string[]
  redirectUrl: URL
}): Promise<{
  envLocal: string
  siteApiKey: string
  example: string | null
}> {
  const handshakePort = await detectPort(5600)

  const callbackUrl = `http://localhost:${handshakePort}/${siteSelectionPath}`
  // Handshake Step 1
  const selectSiteUrl = new URL(`${MAKESWIFT_APP_ORIGIN}/cli/select-site`)
  selectSiteUrl.searchParams.set('project_name', projectName)
  selectSiteUrl.searchParams.set('callback_url', callbackUrl)
  passedInExample && selectSiteUrl.searchParams.set('example', passedInExample)
  template && selectSiteUrl.searchParams.set('template', template)

  if (env.length > 0) {
    selectSiteUrl.searchParams.set('env_vars', env.join(','))
  }

  const selectSiteUrlString = selectSiteUrl.toString()

  console.log(
    `\nOpening your browser at ${chalk.blue(
      selectSiteUrlString,
    )}\n\nIf anything happens, re-open that URL.`,
  )
  await open(selectSiteUrlString)

  // Handshake Step 2 - the browser goes to `callbackUrl`

  // Handshake Step 3 - we redirect the browser to redirectUrl
  const { siteApiKey, example, envVars } = await getSiteMetadata({
    port: handshakePort,
    redirectUrl: redirectUrl.toString(),
  })

  // In the background, we're setting up the Next app with the API key
  // and starting the app at `nextAppPort`
  // @todo: once we can define env vars in the browser, remove ...env.
  //        This is because we want the browser choices to override the
  //        ones passed in via the CLI.
  const envLocal = buildLocalEnvFile(
    {
      MAKESWIFT_SITE_API_KEY: siteApiKey,
      MAKESWIFT_API_ORIGIN,
    },
    envVars,
  )

  // Handshake Step 4 - Makeswift redirects to the builder with the site open,
  //                    with the host using `nextAppUrl` for the builder

  return { siteApiKey, envLocal, example: example || passedInExample || null }
}

export async function getSiteMetadata({
  port,
  redirectUrl,
}: {
  port: number
  redirectUrl: string
}): Promise<{
  siteApiKey: string
  example: string | null
  envVars: string[]
}> {
  return new Promise<{
    siteApiKey: string
    example: string | null
    envVars: string[]
  }>((resolve, reject) => {
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

        const commaSeparatedEnvVars = queryParams.get('env_vars')
        let envVars: string[] = []

        if (commaSeparatedEnvVars != null && commaSeparatedEnvVars.length != 0) {
          const pairs = commaSeparatedEnvVars.split(',')

          envVars = pairs
        }

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
              envVars,
            })
          })
        })
      })
      .listen(port)

    server.on('connection', function (socket: Socket) {
      sockets.push(socket)
    })
  })
}

export function buildLocalEnvFile(
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
