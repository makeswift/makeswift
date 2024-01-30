import * as os from 'os'
import spawn from 'cross-spawn'
import glob from 'glob'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import path from 'path'
import { isAlreadyIntegrated, manipulateNextConfig } from './utils/manipulate-next-config'
import { createFolderIfNotExists } from './utils/create-folder-if-not-exists'
import chalk from 'chalk'
import MakeswiftError from './errors/MakeswiftError'
import { detect as detectPackageManager, PM } from 'detect-package-manager'

type PagesFolder = {
  absolute: string
  temporary: string
}

function generateTemporaryApp({ dir }: { dir: string }) {
  const temporaryDirectory = fs.mkdtempSync(os.tmpdir())
  const pagesFolder = getPagesFolder({ dir, temporaryDir: temporaryDirectory })

  createFolderIfNotExists(pagesFolder.temporary)

  return temporaryDirectory
}

function overwriteIntegratedFiles({ dir, temporaryDir }: { dir: string; temporaryDir: string }) {
  const makeswiftFiles = readAllFilesInDir(temporaryDir)

  for (const file of makeswiftFiles) {
    const relativePath = file.split(`${temporaryDir}/`)[1]
    const filePath = path.join(dir, relativePath)
    const filePathObject = path.parse(filePath)
    fs.mkdirSync(filePathObject.dir, { recursive: true })

    fs.copyFileSync(file, filePath)
  }
}

function readAllFilesInDir(dir: string) {
  function recursivelyReadFolder(dir: string, files: string[]) {
    const filesInDir = fs.readdirSync(dir)

    for (const file of filesInDir) {
      const fullFilepath = path.join(dir, file)
      if (fs.lstatSync(fullFilepath).isDirectory()) {
        recursivelyReadFolder(fullFilepath, files)
        continue
      }

      files.push(fullFilepath)
    }

    return files
  }

  const files: string[] = []
  recursivelyReadFolder(dir, files)

  return files
}

export async function integrateNextApp({
  dir,
  useNpm,
  usePnpm,
}: {
  dir: string
  useNpm: boolean
  usePnpm: boolean
}): Promise<void> {
  console.log('Integrating Next.js app')
  const isTS = isTypeScript({ dir })

  // Integrate pages in a temporary directory
  const temporaryDir = generateTemporaryApp({ dir })
  const pagesFolder = getPagesFolder({ dir, temporaryDir })

  // Step 1 - add Makeswift API route
  addMakeswiftApiRoute({ isTypeScript: isTS, pagesFolder })

  // Step 2 - add Makeswift pages
  addMakeswiftPages({ temporaryDir, isTypeScript: isTS, pagesFolder })

  // Step 3 - adding the Makeswift Next.js plugin
  addMakeswiftNextjsPlugin({ dir, temporaryDir })

  // Step 4 - install the runtime
  await installMakeswiftRuntime({ dir, useNpm, usePnpm })

  // Overwrite pages and next.config.js with output from temporary directory
  overwriteIntegratedFiles({ dir, temporaryDir })
}

async function installMakeswiftRuntime({
  dir,
  useNpm,
  usePnpm,
}: {
  dir: string
  useNpm: boolean
  usePnpm: boolean
}): Promise<void> {
  let packageManager: PM
  if (useNpm) packageManager = 'npm'
  else if (usePnpm) packageManager = 'pnpm'
  else packageManager = await detectPackageManager({ cwd: dir })

  switch (packageManager) {
    case 'npm':
      spawn.sync('npm', ['install', '@makeswift/runtime'], {
        stdio: 'inherit',
        cwd: dir,
      })
      break

    case 'yarn':
      spawn.sync('yarn', ['add', '@makeswift/runtime'], {
        stdio: 'inherit',
        cwd: dir,
      })
      break

    case 'pnpm':
      spawn.sync('pnpm', ['add', '@makeswift/runtime'], {
        stdio: 'inherit',
        cwd: dir,
      })
      break
  }
}

function addMakeswiftApiRoute({
  isTypeScript,
  pagesFolder,
}: {
  isTypeScript: boolean
  pagesFolder: PagesFolder
}): void {
  const extension = isTypeScript ? 'ts' : 'js'

  fs.mkdirSync(path.join(pagesFolder.temporary, 'api', 'makeswift'), { recursive: true })

  const apiRoute = isTypeScript
    ? `import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY!)
`
    : `import { MakeswiftApiHandler } from '@makeswift/runtime/next'

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY)
`
  fs.writeFileSync(
    path.join(pagesFolder.temporary, 'api', 'makeswift', `[...makeswift].${extension}`),
    apiRoute,
  )
}

function addMakeswiftPages({
  temporaryDir,
  isTypeScript,
  pagesFolder,
}: {
  temporaryDir: string
  isTypeScript: boolean
  pagesFolder: PagesFolder
}): void {
  function generateCatchAllRoute(isTypeScript: boolean) {
    switch (isTypeScript) {
      case false:
        return `import '../lib/makeswift/register-components'

import { Makeswift, Page as MakeswiftPage } from '@makeswift/runtime/next'

export async function getStaticPaths() {
  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY)
  const pages = await makeswift.getPages()

  return {
    paths: pages.map((page) => ({
      params: {
        path: page.path.split('/').filter((segment) => segment !== ''),
      },
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps(ctx) {
  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY)
  const path = '/' + (ctx.params?.path ?? []).join('/')
  const snapshot = await makeswift.getPageSnapshot(path, {
    siteVersion: Makeswift.getSiteVersion(ctx.previewData)
  })

  if (snapshot == null) return { notFound: true }

  return { props: { snapshot } }
}

export default function Page({ snapshot }) {
  return <MakeswiftPage snapshot={snapshot} />
}`
      case true:
        return `import '../lib/makeswift/register-components'

import { Makeswift } from '@makeswift/runtime/next'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { Page as MakeswiftPage, PageProps as MakeswiftPageProps } from '@makeswift/runtime/next'

type ParsedUrlQuery = { path?: string[] }

export async function getStaticPaths(): Promise<GetStaticPathsResult<ParsedUrlQuery>> {
  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY!)
  const pages = await makeswift.getPages()

  return {
    paths: pages.map(page => ({
      params: { path: page.path.split('/').filter(segment => segment !== '') },
    })),
    fallback: 'blocking',
  }
}

type Props = MakeswiftPageProps

export async function getStaticProps(
  ctx: GetStaticPropsContext<ParsedUrlQuery>,
): Promise<GetStaticPropsResult<Props>> {
  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY!)
  const path = '/' + (ctx.params?.path ?? []).join('/')
  const snapshot = await makeswift.getPageSnapshot(path, {
    siteVersion: Makeswift.getSiteVersion(ctx.previewData),
  })

  if (snapshot == null) return { notFound: true }

  return { props: { snapshot } }
}

export default function Page({ snapshot }: Props) {
  return <MakeswiftPage snapshot={snapshot} />
}`
    }
  }

  // catch all route
  const catchAllRoute = generateCatchAllRoute(isTypeScript)
  const extension = isTypeScript ? 'ts' : 'js'

  // catch-all-route does not exist
  if (glob.sync(path.join(pagesFolder.absolute, `\\[*\\].${extension}*`)).length === 0) {
    const useOptionalCatchAllRoute =
      !fs.existsSync(path.join(pagesFolder.absolute, `index.${extension}`)) &&
      !fs.existsSync(path.join(pagesFolder.absolute, `index.${extension}x`))

    let catchAllRouteFilename
    if (useOptionalCatchAllRoute) {
      catchAllRouteFilename = `[[...path]].${extension}x`
    } else {
      catchAllRouteFilename = `[...path].${extension}x`

      console.log(
        `\nWe noticed you have an index page, therefore we have created a ${chalk.yellow(
          'normal catch-all route',
        )} in Next.js. This will not match the index route \`/\`.\nRead more about that here: ${chalk.blue(
          'https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes',
        )}`,
      )
    }

    fs.writeFileSync(path.join(pagesFolder.temporary, catchAllRouteFilename), catchAllRoute)
  } else {
    throw new MakeswiftError(
      'A dynamic route already exists, you will have to manually integrate: https://www.makeswift.com/docs/guides/advanced-setup#custom-live-route',
    )
  }

  // custom document
  if (
    fs.existsSync(path.join(pagesFolder.absolute, `_document.${extension}`)) ||
    fs.existsSync(path.join(pagesFolder.absolute, `_document.${extension}x`))
  ) {
    throw new MakeswiftError(
      `A custom document already exists, you will have to manually integrate: ${chalk.blue(
        'https://www.makeswift.com/docs/guides/advanced-setup#extending-the-custom-document',
      )}`,
    )
  }
  const customDocument = `export { Document as default } from '@makeswift/runtime/next'`
  fs.writeFileSync(path.join(pagesFolder.temporary, `_document.${extension}`), customDocument)

  // register components file
  fs.mkdirSync(path.join(temporaryDir, 'lib', 'makeswift'), { recursive: true })
  const registerComponentsFile = `import { Style } from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'
import { HelloWorld } from '../../components/hello-world'

// Register your components here!

ReactRuntime.registerComponent(HelloWorld, {
  type: 'hello-world',
  label: 'Hello, world!',
  props: {
    className: Style({ properties: Style.All }),
  },
})
`
  fs.writeFileSync(
    path.join(
      temporaryDir,
      'lib',
      'makeswift',
      `register-components.${isTypeScript ? 'ts' : 'js'}`,
    ),
    registerComponentsFile,
  )

  // hello world component
  fs.mkdirSync(path.join(temporaryDir, 'components'))
  if (isTypeScript) {
    fs.writeFileSync(
      path.join(temporaryDir, 'components', 'hello-world.tsx'),
      `import React from 'react'

type Props = {
  className?: string
}

export function HelloWorld({ className }: Props) {
  return <p className={className}>Hello, world!</p>
}
`,
    )
  } else {
    fs.writeFileSync(
      path.join(temporaryDir, 'components', 'hello-world.jsx'),
      `import React from 'react'

      export function HelloWorld(props) {
  return <p {...props}>Hello, world!</p>
}
`,
    )
  }
}

function getPagesFolder({ dir, temporaryDir }: { dir: string; temporaryDir: string }): PagesFolder {
  if (fs.existsSync(path.join(dir, 'pages'))) {
    return {
      absolute: path.join(dir, 'pages'),
      temporary: path.join(temporaryDir, 'pages'),
    }
  }

  if (fs.existsSync(path.join(dir, 'src/pages'))) {
    return {
      absolute: path.join(dir, '/src/pages'),
      temporary: path.join(temporaryDir, '/src/pages'),
    }
  }

  throw new MakeswiftError('Cannot find pages directory in Next.js app.')
}

function isTypeScript({ dir }: { dir: string }): boolean {
  function hasTSConfig(dir: string): boolean {
    return fs.existsSync(path.join(dir, 'tsconfig.json'))
  }

  function hasTSDependency(dir: string): boolean {
    const packageJsonFile = path.join(dir, 'package.json')

    if (fs.existsSync(packageJsonFile)) {
      const packageJson = require(packageJsonFile)
      const { dependencies, devDependencies } = packageJson

      return 'typescript' in dependencies || 'typescript' in devDependencies
    }

    return false
  }

  if (hasTSConfig(dir) || hasTSDependency(dir)) {
    return true
  }

  return false
}

function addMakeswiftNextjsPlugin({ dir, temporaryDir }: { dir: string; temporaryDir: string }) {
  // @todo: support ES modules
  if (fs.existsSync(path.join(dir, 'next.config.mjs'))) {
    throw new MakeswiftError(
      "We currently don't support automatic integration an ES modules Next.js config.",
    )
  }

  const configFilename = path.join(dir, 'next.config.js')
  const writeLocation = path.join(temporaryDir, 'next.config.js')
  const alreadyExists = fs.existsSync(configFilename)

  if (!alreadyExists) {
    const nextConfig = `
const withMakeswift = require('@makeswift/runtime/next/plugin')()

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withMakeswift(nextConfig)
    `
    fs.writeFileSync(writeLocation, nextConfig)

    return
  }

  const code = fs.readFileSync(configFilename).toString('utf-8')
  if (!isAlreadyIntegrated(code)) {
    const outputCode = manipulateNextConfig(code)

    fs.writeFileSync(writeLocation, outputCode)
  } else {
    throw new MakeswiftError(
      `The ${chalk.cyan(
        'next.config.js',
      )} appears to already be integrated. Did you mean to do this? The CLI needs a normal, unintegrated ${chalk.cyan(
        'next.config.js',
      )} in order to work.`,
    )
  }
}
