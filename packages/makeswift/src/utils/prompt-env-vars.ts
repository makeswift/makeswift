import chalk from 'chalk'
import inquirer from 'inquirer'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Parses environment variable content to extract variable names.
 * Looks for lines in the format: VARIABLE_NAME=value or VARIABLE_NAME=
 * Skips empty lines and comments.
 */
function parseEnvVarFromString(envContent: string): Set<string> {
  const lines = envContent.split('\n')
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

  return envVars
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

  return inquirer.prompt<Record<string, string>>(questions)
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

  let requiredVars: string[] = []
  try {
    const content = fs.readFileSync(envExamplePath, 'utf-8')
    requiredVars = Array.from(parseEnvVarFromString(content))
  } catch (error) {
    console.warn(chalk.yellow(`Warning: Could not read ${envExamplePath}`))
  }

  if (requiredVars.length === 0) {
    return existingEnvContent
  }

  const existingVars = parseEnvVarFromString(existingEnvContent)
  const missingVars = requiredVars.filter(varName => !existingVars.has(varName))

  if (missingVars.length === 0) {
    return existingEnvContent
  }

  const userProvidedVars = await promptForEnvVars(missingVars)

  // Build the additional env vars string
  let additionalEnvVars = Object.entries(userProvidedVars)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  // Add trailing newline if we have content
  if (additionalEnvVars) {
    additionalEnvVars += '\n'
  }

  // Ensure proper newline separation between existing and new content
  let allEnvVars = existingEnvContent
  if (allEnvVars && !allEnvVars.endsWith('\n')) {
    allEnvVars += '\n'
  }
  allEnvVars += additionalEnvVars

  return allEnvVars
}
