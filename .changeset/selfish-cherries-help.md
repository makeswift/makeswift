---
'@makeswift/runtime': minor
---

This version includes the stable release of the localization feature.

With this feature, you can create different variations of a page. For example, if you have a `/pricing` page that you want to localize for Spanish-speaking countries, you can add an `es` locale, and create a `/es/pricing` page.

If you have used the unstable version before, here are the steps required to migrate to the stable version:

- Remove `unstable_i18n` on the `ReactRuntime`.
- Rename `unstable_locale` to `locale` on the `getPageSnapshot`.

Now, all locales and default locale can be managed directly in the **settings in the builder**, on the _Locales_ tab.

You can also add the domain on the locale if you want to use domain-based localization. For example, if your main domain is `company.com`, on your `es` locale, you can add the `company.es` domain to make it the domain for your Spanish version of the site.

If you're interested in this feature, reach out to our support at [support@makeswift.com](mailto:support@makeswift.com).
