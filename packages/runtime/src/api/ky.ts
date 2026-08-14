// `ky` is an ESM-only package: it has no `require` condition in its exports map
// and ships no CommonJS build. Because we build with `bundle: false`, importing
// it directly would leave a bare `require('ky')` in our CommonJS output, which
// throws `ERR_REQUIRE_ESM` on any host whose loader doesn't implement
// `require(esm)` — older Node, or a platform that patches `Module._load` (some
// serverless runtimes do).
//
// Routing every `ky` import through this module lets us bundle `ky` into the
// CommonJS build, so the shipped `dist/cjs` output never requires it. See the
// `ky` entry in `tsup.config.ts`.
export { default, HTTPError, isHTTPError } from 'ky'
export type { KyInstance } from 'ky'
