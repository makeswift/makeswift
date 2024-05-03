---
'@makeswift/runtime': minor
---

BREAKING CHANGE: Remove deprecated `RichText` PropControllers from `@makeswift/runtime/prop-controllers`.

This breaking change only affects a minority of users who are upgrading from versions older than `0.0.7`.

To migrate to the new version: update your components to use `RichText` from `@makeswift/runtime/controls` instead of `@makeswift/runtime/prop-controllers`.

Example migration:

```diff
- import { RichText } from '@makeswift/runtime/prop-controllers';
+ import { RichText } from '@makeswift/runtime/controls';
```
