# Agents

## Cursor Cloud specific instructions

### Overview

This is the **Makeswift** monorepo — an open-source visual page builder SDK for React/Next.js. It is a pure frontend/SDK project (no Docker, databases, or backend services). The product consists of npm packages that integrate with the hosted Makeswift builder at `app.makeswift.com`.

### Monorepo structure

- **Package manager:** pnpm 9.15.4 with workspaces (see `pnpm-workspace.yaml`)
- **Build orchestration:** Turborepo (`turbo.json`)
- **Workspace packages:** `packages/*` (runtime, controls, prop-controllers, makeswift CLI, next-plugin, express-react, hono-react, react-router)
- **Test apps:** `apps/nextjs-app-router`, `apps/nextjs-pages-router`
- **Examples:** `examples/*` (not part of the pnpm workspace — have their own `package.json` and separate dependency trees)

### Key commands

| Task | Command | Notes |
|------|---------|-------|
| Install deps | `pnpm install` | Run from workspace root |
| Build all packages | `pnpm run build` | Turborepo handles dependency ordering |
| Run all tests | `pnpm run test` | Jest tests across packages |
| Format check | `npx prettier --check "packages/**" "apps/**"` | Root `pnpm format` uses `--write` |
| Lint (app-router) | `pnpm --filter nextjs-app-router lint` | ESLint via Next.js |
| Dev watch (runtime) | `pnpm --filter @makeswift/runtime dev` | Concurrent tsc + tsup watch |
| Dev server (app-router) | `pnpm --filter nextjs-app-router dev` | Next.js on port 3000 |
| Dev server (pages-router) | `pnpm --filter nextjs-pages-router dev` | Next.js on different port |

### Important caveats

- The test apps (`apps/*`) require a `MAKESWIFT_SITE_API_KEY` environment variable to render pages. Without it, pages return HTTP 500 but the dev server still compiles and serves static assets correctly. Unit tests run without any API key.
- The root `prettier --check .` will fail with a missing `@trivago/prettier-plugin-sort-imports` error because `examples/` directories reference that plugin but aren't part of the workspace. Run prettier against `packages/` and `apps/` only.
- Build order matters: packages depend on each other via `workspace:*`. Always use `pnpm run build` (turborepo) rather than building individual packages unless you know the dependency graph.
- The `@makeswift/runtime` package is the core library; most tests live there (133 test suites).
