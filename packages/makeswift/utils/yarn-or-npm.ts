import * as fs from 'fs'
import path from 'path'

function yarnOrNpm(projectDirectory: string): 'yarn' | 'npm' {
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

  throw Error('Cannot determine whether or not Next.js app uses Yarn or NPM.')
}
