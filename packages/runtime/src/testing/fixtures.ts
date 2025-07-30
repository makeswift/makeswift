import { type SiteVersion } from '../next'

export const TestWorkingSiteVersion: SiteVersion = {
  version: 'draft',
  token:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYWtlc3dpZnQtcnVudGltZSIsImlhdCI6MTc1NDU5OTE0OSwiZXhwIjo0MTAyNDMyNzQ5LCJhdWQiOiJ0ZXN0Iiwic3ViIjoibWFrZXN3aWZ0LXJ1bnRpbWUifQ.-1BDOmEN1Q1QeKP7qfjPyAkrKRjb4q4qaqyhPBvMnhg',
} as const

export const TestOrigins = {
  apiOrigin: 'https://api.fakeswift.com',
  appOrigin: 'https://app.fakeswift.com',
} as const
