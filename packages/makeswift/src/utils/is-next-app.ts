import path from 'path'
import * as fs from 'fs'

function isNextApp(appDirectory: string): boolean {
  return hasNextDependency(appDirectory) && hasPagesFolder(appDirectory)
}

function hasNextDependency(appDirectory: string): boolean {
  try {
    const packageJson = require(path.join(appDirectory, 'package.json'))
    const { dependencies } = packageJson

    return 'next' in dependencies
  } catch (error) {
    if (error instanceof Error) {
      /* do nothing */
    }
  }

  return false
}

function hasPagesFolder(appDirectory: string): boolean {
  return (
    fs.existsSync(path.join(appDirectory, 'pages')) ||
    fs.existsSync(path.join(appDirectory, 'src', 'pages'))
  )
}

export default isNextApp
