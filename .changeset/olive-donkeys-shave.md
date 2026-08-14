---
'@makeswift/runtime': patch
---

Fix `ERR_REQUIRE_ESM` error when loading the runtime from a CJS host, due to `ky` being an ESM-only package. `ky` is now bundled into the CJS build, so `dist/cjs` no longer `require`s it.
