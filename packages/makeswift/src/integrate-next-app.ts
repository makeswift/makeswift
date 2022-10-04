import spawn from 'cross-spawn'
import glob from 'glob'
import * as fs from 'fs'
import path from 'path'
import { manipulateNextConfig } from './utils/manipulate-next-config'
import { yarnOrNpm } from './utils/yarn-or-npm'
import { createFolderIfNotExists } from './utils/create-folder-if-not-exists'
import inquirer from 'inquirer'
import chalk from 'chalk'

async function getApprovalToIntegrate(dir: string): Promise<boolean> {
  const projectName = dir.split('/').reduce((prev, curr) => curr)
  return new Promise(resolve => {
    const questions = [
      {
        type: 'confirm',
        name: 'approval',
        default: false,
        message: `It appears ${chalk.cyan(
          projectName,
        )} is an existing Next.js app — would you like to integrate it?`,
      },
    ]

    inquirer.prompt(questions).then(answers => {
      if (typeof answers.approval == 'boolean') {
        resolve(answers.approval)
      } else {
        throw Error('Something went wrong')
      }
    })
  })
}

export async function integrateNextApp({ dir }: { dir: string }): Promise<void> {
  const approval = await getApprovalToIntegrate(dir)
  if (!approval) {
    console.log('Will not integrate project ${dir}.')
    return
  }

  console.log('Integrating Next.js app')
  const isTS = isTypeScript({ dir })

  // Step 1 - install the runtime
  installMakeswiftRuntime({ dir })

  // Step 2 - add Makeswift API route
  addMakeswiftApiRoute({ dir, isTypeScript: isTS })

  // Step 3 - add Makeswift pages
  addMakeswiftPages({ dir, isTypeScript: isTS })

  // Step 4 - adding the Makeswift Next.js plugin
  addMakeswiftNextjsPlugin({ dir })
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

function addMakeswiftApiRoute({ dir, isTypeScript }: { dir: string; isTypeScript: boolean }): void {
  const pagesFolder = getPagesFolder({ dir })
  const extension = isTypeScript ? 'ts' : 'js'

  // If Makeswift API folder does not exist, create
  createFolderIfNotExists(path.join(pagesFolder, 'api'))
  createFolderIfNotExists(path.join(pagesFolder, 'api', 'makeswift'))

  const apiRoute = isTypeScript
    ? `import { MakeswiftApiHandler } from '@makeswift/runtime/next'

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY!)
`
    : `import { MakeswiftApiHandler } from '@makeswift/runtime/next'

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY)
`
  fs.writeFileSync(
    path.join(pagesFolder, 'api', 'makeswift', `[...makeswift].${extension}`),
    apiRoute,
  )
}

function addMakeswiftPages({ dir, isTypeScript }: { dir: string; isTypeScript: boolean }): void {
  const pagesFolder = getPagesFolder({ dir })

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
    fs.writeFileSync(path.join(pagesFolder, catchAllRouteFilename), catchAllRoute)
  } else {
    throw new Error(
      'A catch all route already exists, you will have to manually integrate: https://www.makeswift.com/docs/guides/advanced-setup#custom-live-route',
    )
  }

  // custom document
  if (
    fs.existsSync(path.join(pagesFolder, `_document.${extension}`)) ||
    fs.existsSync(path.join(pagesFolder, `_document.${extension}x`))
  ) {
    throw new Error(
      'A custom document already exists, you will have to manually integrate: https://www.makeswift.com/docs/guides/manual-setup#set-up-custom-document',
    )
  }
  const customDocument = `export { Document as default } from '@makeswift/runtime/next'`
  fs.writeFileSync(path.join(pagesFolder, `_document.${extension}`), customDocument)
}

function getPagesFolder({ dir }: { dir: string }): string {
  if (fs.existsSync(path.join(dir, 'pages'))) {
    return path.join(dir, 'pages')
  }

  if (fs.existsSync(path.join(dir, 'src/pages'))) {
    return path.join(dir, '/src/pages')
  }

  throw Error('Cannot find pages directory in Next.js app.')
}

function isTypeScript({ dir }: { dir: string }): boolean {
  function hasTSConfig(dir: string): boolean {
    return fs.existsSync(path.join(dir, 'tsconfig.json'))
  }

  function hasTSDependency(dir: string): boolean {
    try {
      const packageJson = require(path.join(dir, 'package.json'))
      const { dependencies, devDependencies } = packageJson

      return 'typescript' in dependencies || 'typescript' in devDependencies
    } catch (error) {
      if (error instanceof Error) console.log(error.message)
    }

    return false
  }

  if (hasTSConfig(dir) || hasTSDependency(dir)) {
    return true
  }

  return false
}

function addMakeswiftNextjsPlugin({ dir }: { dir: string }) {
  // @todo: support ES modules
  if (fs.existsSync(path.join(dir, 'next.config.mjs'))) {
    throw new Error(
      "We currently don't support automatic integration an ES modules Next.js config.",
    )
  }

  const configFilename = path.join(dir, 'next.config.js')
  const alreadyExists = fs.existsSync(configFilename)

  if (!alreadyExists) {
    const nextConfig = `
const withMakeswift = require('@makeswift/runtime/next/plugin')()

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withMakeswift(nextConfig)
    `
    fs.writeFileSync(configFilename, nextConfig)

    return
  }

  const code = fs.readFileSync(configFilename)
  const outputCode = manipulateNextConfig(code.toString('utf-8'))

  fs.writeFileSync(configFilename, outputCode)
}
