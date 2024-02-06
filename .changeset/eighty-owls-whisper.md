---
'makeswift': patch
---

Update the CLI to support Bun.

Opening the CLI with `bunx makeswift init` now uses Bun for all commands.
The `--use-bun` flag was also added to force the CLI to use Bun regardless of which package manager it was opened with.
