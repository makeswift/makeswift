import chalk from 'chalk'
import * as fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import isNextApp from './is-next-app'

const DEFAULT_PROJECT_NAME = 'my-app'
function getDefaultName() {
  let name = DEFAULT_PROJECT_NAME
  let folderPath = path.join(process.cwd(), DEFAULT_PROJECT_NAME)

  let i = 1
  while (fs.existsSync(folderPath)) {
    name = `${DEFAULT_PROJECT_NAME}-${i}`
    folderPath = path.join(process.cwd(), name)
    i += 1
  }

  return name
}

async function validateProjectName(input: string) {
  if (/\.+($|\/)/.test(input)) {
    return 'Relative pathnames not allowed.'
  }

  return true
}

async function askForProjectName(): Promise<string | undefined> {
  return new Promise(resolve => {
    const questions = [
      {
        type: 'input',
        name: 'projectName',
        message: 'What would you like to name your project?',
        validate: validateProjectName,
      },
    ]

    inquirer.prompt(questions).then(answers => {
      resolve(answers.projectName)
    })
  })
}

async function askToUseCurrentDirectory(dir: string): Promise<boolean> {
  const projectName = dir.split('/').at(-1)
  return new Promise(resolve => {
    const questions = [
      {
        type: 'confirm',
        name: 'approval',
        default: false,
        message: `It appears this directory is an existing ${chalk.green(
          'Next.js',
        )} app — would you like to use it?`,
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

async function askApprovalToIntegrateIfNeeded(dir: string): Promise<void> {
  const projectName = dir.split('/').at(-1)
  async function askApproval(): Promise<boolean> {
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

  if (isNextApp(dir)) {
    const approval = await askApproval()

    if (!approval) {
      throw Error('Will not integrate Next app.')
    }
  }
}

export async function getProjectName(
  name: string | undefined,
): Promise<{ name: string; directory: string }> {
  const currentDir = process.cwd()

  // 1. If the user passed a name, use that
  if (name != null) {
    const dir = path.join(currentDir, name)
    await askApprovalToIntegrateIfNeeded(dir)

    return { name, directory: dir }
  }

  // 2. If the current directory is a Next.js app, ask the user if they want to use that
  const isCurrentDirNextApp = isNextApp(currentDir)
  if (isCurrentDirNextApp) {
    const useCurrentApp = await askToUseCurrentDirectory(currentDir)

    if (useCurrentApp) {
      return { directory: currentDir, name: currentDir.split('/').at(-1)! }
    }
  }

  // 3. Prompt the user for the project name
  const projectName = await askForProjectName()

  if (projectName == null || projectName.length === 0) {
    const name = getDefaultName()
    return { name, directory: path.join(currentDir, name) }
  }

  const nextAppDir = path.join(process.cwd(), projectName)
  await askApprovalToIntegrateIfNeeded(nextAppDir)

  return { name: projectName, directory: nextAppDir }
}
