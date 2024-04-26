---
'@makeswift/runtime': minor
---

BREAKING CHANGE: Remove deprecated `List`, `Shape`, and `Typeahead` PropControllers from `@makeswift/runtime/prop-controllers`.

This breaking change only affects a minority of users who are upgrading from versions older than `0.0.7`.

To migrate to the new version: update your components to use `List`, `Shape`, and `Combobox` from `@makeswift/runtime/controls` instead of `@makeswift/runtime/prop-controllers`.

Example migration:

```diff
- import { List, Shape } from '@makeswift/runtime/prop-controllers';
+ import { List, Shape } from '@makeswift/runtime/controls';
```
