import chalk from 'chalk'
import inquirer from 'inquirer'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Extracts environment variable names from a .env.example file.
 * Looks for lines in the format: VARIABLE_NAME=value or VARIABLE_NAME=
 */
function parseEnvExampleFile(filePath: string): string[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    const envVars = new Set<string>()

    for (const line of lines) {
      const trimmed = line.trim()

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      // Parse variable line (KEY= or KEY=value)
      const equalIndex = trimmed.indexOf('=')
      if (equalIndex > 0) {
        const varName = trimmed.substring(0, equalIndex).trim()

        envVars.add(varName)
      }
    }

    return Array.from(envVars)
  } catch (error) {
    return []
  }
}

/**
 * Parses existing .env.local content to extract variable names
 */
function parseExistingEnvVars(envContent: string): Set<string> {
  const lines = envContent.split('\n')
  const existingVars = new Set<string>()

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const equalIndex = trimmed.indexOf('=')
      if (equalIndex > 0) {
        const varName = trimmed.substring(0, equalIndex).trim()
        existingVars.add(varName)
      }
    }
  }

  return existingVars
}

/**
 * Prompts user to provide values for missing environment variables
 */
async function promptForEnvVars(missingVars: string[]): Promise<Record<string, string>> {
  if (missingVars.length === 0) {
    return {}
  }

  console.log(chalk.yellow(`\n📎  Enter your environment variables:\n`))

  const questions = missingVars.map(varName => ({
    type: 'input',
    name: varName,
    message: `${varName}:`,
    default: '',
  }))

  const answers = await inquirer.prompt(questions)
  return answers as Record<string, string>
}

/**
 * Reads the .env.example file from the example, prompts for missing variables,
 * and returns the updated .env.local content
 */
export async function promptForMissingEnvVars(
  nextAppDir: string,
  existingEnvContent: string,
): Promise<string> {
  const envExamplePath = path.join(nextAppDir, '.env.example')

  if (!fs.existsSync(envExamplePath)) {
    return existingEnvContent
  }

  const requiredVars = parseEnvExampleFile(envExamplePath)

  if (requiredVars.length === 0) {
    return existingEnvContent
  }

  const existingVars = parseExistingEnvVars(existingEnvContent)
  const missingVars = requiredVars.filter(varName => !existingVars.has(varName))

  if (missingVars.length === 0) {
    return existingEnvContent
  }

  const userProvidedVars = await promptForEnvVars(missingVars)

  // Build the additional env vars string
  let additionalEnvVars = ''
  for (const [key, value] of Object.entries(userProvidedVars)) {
    if (value.trim()) {
      additionalEnvVars += `${key}=${value}\n`
    }
  }

  const allEnvVars = existingEnvContent + additionalEnvVars
  return allEnvVars
}
