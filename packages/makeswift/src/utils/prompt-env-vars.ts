import chalk from 'chalk'
import inquirer from 'inquirer'
import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'

/**
 * Prompts user to provide values for missing environment variables
 */
async function promptForEnvVars(
  missingVars: string[],
  defaultValues: Record<string, string>,
): Promise<Record<string, string>> {
  if (missingVars.length === 0) {
    return {}
  }

  console.log(chalk.yellow(`\n📎  Enter your environment variables:\n`))

  const questions = missingVars.map(varName => ({
    type: 'input',
    name: varName,
    message: `${varName}:`,
    default: defaultValues[varName] || '',
  }))

  return inquirer.prompt<Record<string, string>>(questions)
}

/**
 * Reads the .env.example file from the example, prompts for missing variables,
 * and returns the updated environment variables as a record
 */
export async function promptForMissingEnvVars(
  nextAppDir: string,
  existingEnv: Record<string, string>,
): Promise<Record<string, string>> {
  const envExamplePath = path.join(nextAppDir, '.env.example')

  if (!fs.existsSync(envExamplePath)) {
    return existingEnv
  }

  let exampleEnv: Record<string, string> = {}
  try {
    const content = fs.readFileSync(envExamplePath, 'utf-8')
    exampleEnv = dotenv.parse(content)
  } catch (error) {
    console.warn(chalk.yellow(`Warning: Could not read ${envExamplePath}`))
    return existingEnv
  }

  const missingVars = Object.keys(exampleEnv).filter(varName => !(varName in existingEnv))

  if (missingVars.length === 0) {
    return existingEnv
  }

  const userProvidedVars = await promptForEnvVars(missingVars, exampleEnv)

  // Only include vars that have non-empty values
  const filteredUserVars = Object.fromEntries(
    Object.entries(userProvidedVars).filter(
      ([, value]) => typeof value === 'string' && value.trim(),
    ),
  )

  return { ...existingEnv, ...filteredUserVars }
}
