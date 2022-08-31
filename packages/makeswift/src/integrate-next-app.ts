import spawn from 'cross-spawn'
import glob from 'glob'
import * as fs from 'fs'
import path from 'path'
import { manipulateNextConfig } from './utils/manipulate-next-config'
import { yarnOrNpm } from './utils/yarn-or-npm'

export function integrateNextApp({ dir }: { dir: string }): void {
  console.log('Integrating Next.js app')

  // Step 1 - install the runtime
  installMakeswiftRuntime({ dir })

  // Step 2 - add Makeswift pages
  addMakeswiftPages({ dir })

  // Step 3 - adding the Makeswift Next.js plugin
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

function addMakeswiftPages({ dir }: { dir: string }): void {
  const pagesFolder = getPagesFolder({ dir })
  const extension = getExtension({ dir })

  const previewRoute = `export {
  getServerSideProps,
  Page as default
} from '@makeswift/runtime/next'
`
  fs.writeFileSync(path.join(pagesFolder, `makeswift.${extension}`), previewRoute)

  // catch all route
  const catchAllRoute = `export {
  getStaticProps,
  getStaticPaths,
  Page as default
} from '@makeswift/runtime/next'
`

  // @todo: need to detect if a catch all route already exists
  const catchAllRouteFilename =
    fs.existsSync(path.join(pagesFolder, `index.${extension}`)) ||
    fs.existsSync(path.join(pagesFolder, `index.${extension}x`))
      ? `[...path].${extension}`
      : `[[...path]].${extension}`

  // catch-all-route does not exist
  if (glob.sync(path.join(pagesFolder, `\\[*\\].${extension}*`)).length === 0) {
    fs.writeFileSync(path.join(pagesFolder, catchAllRouteFilename), catchAllRoute)
  } else {
    throw new Error(
      'A catch all route already exists, you will have to manually integrate: https://www.makeswift.com/docs/guides/advanced-setup#custom-live-route',
    )
  }

  // custom document
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

function getExtension({ dir }: { dir: string }): 'js' | 'ts' {
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
    return 'ts'
  }

  return 'js'
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
