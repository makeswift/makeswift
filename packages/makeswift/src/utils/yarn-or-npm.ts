import * as fs from 'fs'
import path from 'path'

export function yarnOrNpm(projectDirectory: string): 'yarn' | 'npm' {
  let lockFileFound = false
  let currentDirectory = projectDirectory
  let layers = 0

  while (!lockFileFound && layers < 7) {
    if (fs.existsSync(path.join(currentDirectory, 'package-lock.json'))) {
      return 'npm'
    }

    if (fs.existsSync(path.join(currentDirectory, 'yarn.lock'))) {
      return 'yarn'
    }

    currentDirectory = path.dirname(currentDirectory)
    layers += 1
  }

  // assume npm if no lockfile
  return 'npm'
}
