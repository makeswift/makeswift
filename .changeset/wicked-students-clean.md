---
'makeswift': patch
---

- fix error where next.config.js fails and CLI keeps going
- make default value for integrating true
- make `init` the default entrypoint to `npx makeswift`
- support `src/pages` folder structures for integration
- validate app name is a valid NPM package name
- add a `register-components.ts` file upon integration