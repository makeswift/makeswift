---
'@makeswift/runtime': minor
---

This change updates the runtime to use the latest version of
`@makeswift/controls`. As part of this update, this package is no longer
exposing internal data types and functions associated with our controls.

## BREAKING:

1. Attempting to create a control with arbitrary configuration options will
   now result in a TypeScript compilation error:

   ```typescript
   import { Number } from '@makeswift/runtime/controls'

   const num = Number({ foo: 'bar' }) // error, `foo` is not a valid `Number` param
   ```

   Prior to this version, the arbitrary options were silently ignored.

2. The `Select` control now requires `options` to be a readonly array with at
   least one entry. If you are not defining your options inline, you may need
   to declare the options `as const`.

   ```typescript
   import { Select } from '@makeswift/runtime/controls'

   const sel = Select({
     label: 'Select',
     options: [], // error, non-empty array is required
   })
   ```

   Previously, the `options` array was allowed to be empty.
