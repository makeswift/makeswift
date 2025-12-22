#!/usr/bin/env node

import { Command } from 'commander'
import init from './init'
import pkg from '../package.json'
import link from './link'

const program = new Command()

program
  .name('Makeswift CLI')
  .description('The official command-line tool to interact with Makeswift.')
  .version(pkg.version)

program
  .command('init', { isDefault: true })
  .description('Create a new Next.js app integrated with Makeswift.')
  .argument('[name]', 'The name of the folder to create.')
  .option('--example <example>', 'The Github URL, or name of the Makeswift example to clone.')
  .option('--template <template>', 'The template slug of the Makeswift template to use.')
  .option('--use-npm', 'Explicitly tell the CLI to bootstrap the app using npm')
  .option('--use-yarn', 'Explicitly tell the CLI to bootstrap the app using yarn')
  .option('--use-pnpm', 'Explicitly tell the CLI to bootstrap the app using pnpm')
  .option('--use-bun', 'Explicitly tell the CLI to bootstrap the app using bun')
  .option(
    '--env <items...>',
    "Provide environment variables as space-separated key=value pairs to go into the Next app's .env file. Example: --env FOO=BAR BAR=FOO",
  )
  .action(init)

program
  .command('link')
  .description(
    'Link an existing Next.js site, already integrated with Makeswift, to a Makeswift site.',
  )
  .option(
    '--template <template>',
    'The template slug of the Makeswift template to use, if creating a new site.',
  )
  .action(link)

program.parse()
