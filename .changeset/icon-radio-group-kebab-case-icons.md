---
"@makeswift/controls": patch
"@makeswift/runtime": patch
---

`IconRadioGroup` icon names are now lowercase kebab-case (e.g. `icon: 'align-left'`, `icon: 'sun'`), matching the convention used for component icons in `registerComponent`. The `IconRadioGroup.Icon.*` accessors still work and now resolve to the kebab-case names. The set of available icons has also been expanded to the full builder icon set, with brand/company logos namespaced under a `logo-` prefix (e.g. `icon: 'logo-apple'`, `icon: 'logo-bigcommerce'`). Legacy icon ids serialized by older runtimes still deserialize: the `*16` ids (`Code16`, `Subscript16`, `Superscript16`) from the released `unstable_IconRadioGroup`, plus the unsuffixed PascalCase inline ids (`Code`, `Subscript`, `Superscript`) from the stabilized pre-kebab `IconRadioGroup` published on the `canary` channel.
