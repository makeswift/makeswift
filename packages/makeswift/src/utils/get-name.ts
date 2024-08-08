import inquirer from 'inquirer'
import path from 'path'

async function validateProjectName(input: string) {
  // taken from https://github.com/dword-design/package-name-regex/blob/master/src/index.js
  const packageNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
  if (!packageNameRegex.test(input)) {
    return 'Project name must be a valid NPM package name.'
  }

  if (/\.+($|\/)/.test(input)) {
    return 'Relative pathnames not allowed.'
  }

  return true
}

async function askForProjectName(): Promise<string> {
  return new Promise(resolve => {
    const questions = [
      {
        type: 'input',
        name: 'projectName',
        message: 'What would you like to name your project?',
        validate: validateProjectName,
        default: 'my-app',
      },
    ]

    inquirer.prompt(questions).then(answers => {
      resolve(answers.projectName)
    })
  })
}

export async function getProjectName(
  name?: string | undefined,
): Promise<{ name: string; directory: string }> {
  const currentDir = process.cwd()

  // 1. If the user passed a name, use that
  if (name != null) {
    const dir = path.join(currentDir, name)

    return { name, directory: dir }
  }

  // 2. Prompt the user for the project name
  const projectName = await askForProjectName()

  const nextAppDir = path.join(process.cwd(), projectName)

  return { name: projectName, directory: nextAppDir }
}
