---
'@makeswift/runtime': minor
---

BREAKING: API changes to support multi-document pages, lays the foundation for enabling multiple editable regions within a single page.

The `ReactRuntimeProvider` component now accepts two new props: `previewMode` and `locale`. The `previewMode` prop is mandatory in all cases, while the `locale` prop is required if your site supports more than one locale. Check out our updated [App Router](https://github.com/makeswift/makeswift/tree/main/examples/basic-typescript) and [Pages Router](https://github.com/makeswift/makeswift/tree/main/examples/basic-typescript-pages) examples to learn how to provide these props in both setups.
