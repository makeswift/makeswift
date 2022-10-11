import * as os from 'os'
import spawn from 'cross-spawn'
import glob from 'glob'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import path from 'path'
import { isAlreadyIntegrated, manipulateNextConfig } from './utils/manipulate-next-config'
import { yarnOrNpm } from './utils/yarn-or-npm'
import { createFolderIfNotExists } from './utils/create-folder-if-not-exists'
import inquirer from 'inquirer'
import chalk from 'chalk'
import MakeswiftError from './errors/MakeswiftError'

function generateTemporaryApp({ dir }: { dir: string }) {
  const temporaryDirectory = fs.mkdtempSync(os.tmpdir())

  createFolderIfNotExists(path.join(temporaryDirectory, 'pages'))

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

export async function integrateNextApp({ dir }: { dir: string }): Promise<void> {
  console.log('Integrating Next.js app')
  const isTS = isTypeScript({ dir })

  // Integrate pages in a temporary directory
  const temporaryDirectory = generateTemporaryApp({ dir })

  // Step 1 - add Makeswift API route
  addMakeswiftApiRoute({ dir, temporaryDir: temporaryDirectory, isTypeScript: isTS })

  // Step 2 - add Makeswift pages
  addMakeswiftPages({ dir, temporaryDir: temporaryDirectory, isTypeScript: isTS })

  // Step 3 - adding the Makeswift Next.js plugin
  addMakeswiftNextjsPlugin({ dir, temporaryDir: temporaryDirectory })

  // Step 4 - install the runtime
  installMakeswiftRuntime({ dir })

  // Overwrite pages and next.config.js with output from temporary directory
  overwriteIntegratedFiles({ dir, temporaryDir: temporaryDirectory })
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

function addMakeswiftApiRoute({
  dir,
  temporaryDir,
  isTypeScript,
}: {
  dir: string
  temporaryDir: string
  isTypeScript: boolean
}): void {
  const temporaryPagesFolder = path.join(temporaryDir, 'pages')
  const extension = isTypeScript ? 'ts' : 'js'

  // If Makeswift API folder does not exist, create
  createFolderIfNotExists(path.join(temporaryPagesFolder, 'api'))
  createFolderIfNotExists(path.join(temporaryPagesFolder, 'api', 'makeswift'))

  const apiRoute = isTypeScript
    ? `import { MakeswiftApiHandler } from '@makeswift/runtime/next'

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY!)
`
    : `import { MakeswiftApiHandler } from '@makeswift/runtime/next'

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY)
`
  fs.writeFileSync(
    path.join(temporaryPagesFolder, 'api', 'makeswift', `[...makeswift].${extension}`),
    apiRoute,
  )
}

function addMakeswiftPages({
  dir,
  temporaryDir,
  isTypeScript,
}: {
  dir: string
  temporaryDir: string
  isTypeScript: boolean
}): void {
  const pagesFolder = getPagesFolder({ dir })
  const temporaryPagesFolder = path.join(temporaryDir, 'pages')

  function generateCatchAllRoute(isTypeScript: boolean) {
    switch (isTypeScript) {
      case false:
        return `import { Makeswift, Page as MakeswiftPage } from '@makeswift/runtime/next'

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
    preview: ctx.preview,
  })

  if (snapshot == null) return { notFound: true }

  return { props: { snapshot } }
}

export default function Page({ snapshot }) {
  return <MakeswiftPage snapshot={snapshot} />
}`
      case true:
        return `import { Makeswift } from '@makeswift/runtime/next'
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
  const snapshot = await makeswift.getPageSnapshot(path, { preview: ctx.preview })

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

  // @todo: need to detect if a catch all route already exists
  const catchAllRouteFilename =
    fs.existsSync(path.join(pagesFolder, `index.${extension}`)) ||
    fs.existsSync(path.join(pagesFolder, `index.${extension}x`))
      ? `[...path].${extension}x`
      : `[[...path]].${extension}x`

  // catch-all-route does not exist
  if (glob.sync(path.join(pagesFolder, `\\[*\\].${extension}*`)).length === 0) {
    fs.writeFileSync(path.join(temporaryPagesFolder, catchAllRouteFilename), catchAllRoute)
  } else {
    throw new MakeswiftError(
      'A catch all route already exists, you will have to manually integrate: https://www.makeswift.com/docs/guides/advanced-setup#custom-live-route',
    )
  }

  // custom document
  if (
    fs.existsSync(path.join(pagesFolder, `_document.${extension}`)) ||
    fs.existsSync(path.join(pagesFolder, `_document.${extension}x`))
  ) {
    throw new MakeswiftError(
      'A custom document already exists, you will have to manually integrate: https://www.makeswift.com/docs/guides/manual-setup#set-up-custom-document',
    )
  }
  const customDocument = `export { Document as default } from '@makeswift/runtime/next'`
  fs.writeFileSync(path.join(temporaryPagesFolder, `_document.${extension}`), customDocument)
}

function getPagesFolder({ dir }: { dir: string }): string {
  if (fs.existsSync(path.join(dir, 'pages'))) {
    return path.join(dir, 'pages')
  }

  if (fs.existsSync(path.join(dir, 'src/pages'))) {
    return path.join(dir, '/src/pages')
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
