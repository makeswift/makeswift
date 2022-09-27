const fs = require('fs')
const path = require('path')
const withTmInitializer = require('next-transpile-modules')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const swc = require('@swc/core')

const NEXT_IMAGE_DOMAINS = ['s.mkswft.com']
const NEXT_TRANSPILE_MODULES_MODULES = ['@makeswift/runtime']

const defaultMakeswiftConfig = {
  components: [],
}

module.exports = ({ resolveSymlinks } = {}) => async (nextConfig = {}) => {
  /** @type {import('next').NextConfig} */
  const enhancedConfig = {
    ...nextConfig,
    compiler: {
      ...nextConfig.compiler,
      styledComponents: true,
    },
    images: {
      ...nextConfig.images,
      domains: [...(nextConfig.images?.domains ?? []), ...NEXT_IMAGE_DOMAINS],
    },
  }

  let makeswiftConfig
  try {
    // @todo: When will this assumption fail? Monorepos?
    const filename = path.join(process.cwd(), 'makeswift.config.js')
    makeswiftConfig = require(filename)
  } catch (err) {
    if (err instanceof Error) {
      if (err.code === 'ENOENT') {
        makeswiftConfig = defaultMakeswiftConfig
      }
    }
  }

  const { components: componentsGlobs } = makeswiftConfig
  let allFiles = []
  for (const globPattern of componentsGlobs) {
    const files = await glob(globPattern, { cwd: process.cwd() })

    if (files != null && files.length > 0) {
      allFiles = allFiles.concat(files)
    }
  }

  const components = await buildComponents(Array.from(new Set(allFiles)))

  // @note: The .next directory keeps getting deleted after this runs
  const outDir = path.join(process.cwd(), '.makeswift')
  await createDotMakeswiftDirectory(outDir)

  const outFile = path.join(outDir, 'components-manifest.json')
  fs.promises.writeFile(outFile, JSON.stringify({ components }))

  return withTmInitializer(NEXT_TRANSPILE_MODULES_MODULES, { resolveSymlinks })(enhancedConfig)
}

async function createDotMakeswiftDirectory(outDir) {
  try {
    await fs.promises.mkdir(outDir)
  } catch (err) {
    if (err instanceof Error) {
      if (err.code === 'EEXIST') {
        /* do nothing */
      }
    }
  }
}

async function buildComponents(files) {
  async function isFileAMakeswiftComponent(file) {
    const fullFilename = path.join(process.cwd(), file)
    const module = await swc.parseFile(fullFilename)

    for (const moduleItem of module.body) {
      if (moduleItem.type === 'ExportDeclaration') {
        if (
          moduleItem.declaration.type === 'VariableDeclaration' &&
          moduleItem.declaration.kind === 'const'
        ) {
          const [firstItem] = moduleItem.declaration.declarations
          if (firstItem != null && firstItem.type === 'VariableDeclarator') {
            if (firstItem.id.type === 'Identifier') {
              if (firstItem.id.value === 'makeswift') {
                if (firstItem.init != null && firstItem.init.type === 'ObjectExpression') {
                  const properties = firstItem.init.properties

                  // @note: property.key.value "type" is type in the Makeswift sense
                  const filteredProperties = properties.filter(
                    property =>
                      property.type === 'KeyValueProperty' &&
                      property.key.type === 'Identifier' &&
                      property.key.value === 'type',
                  )

                  if (filteredProperties.length === 0) {
                    throw Error(
                      `The 'type' property is not defined in your 'makeswift' const export in file ${file}`,
                    )
                  } else if (filteredProperties.length > 1) {
                    throw Error(
                      `The 'type' property is defined multiple times in your 'makeswift' const export in file ${file}`,
                    )
                  }

                  const [typeProperty] = filteredProperties

                  return { isComponent: true, type: typeProperty.value.value }
                }
              }
            }
          }
        }
      }
    }

    return false
  }

  const components = []

  for (const file of files) {
    const { isComponent, type } = await isFileAMakeswiftComponent(file)
    if (isComponent) {
      components.push({ file, type })
    }
  }

  return components
}
