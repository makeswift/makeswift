---
'makeswift': patch
---

Update the CLI to use the package manager it was opened with.

For `npx makeswift init`, the CLI will use `pnpm`.
For `pnpm dlx makeswift init`, the CLI will use `pnpm`.
For `yarn exec makeswift init`, the CLI will use `yarn`.
