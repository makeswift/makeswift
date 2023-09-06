---
'@makeswift/runtime': patch
---

Add locale option to `getSitemap`. If a locale is using domain-based localization, passing the locale to `getSitemap` will return the sitemap for that particular domain.

For example, if in the site settings there is an `es` locale with a domain of `foo.es`, then passing `es` to `getSitemap` will return the sitemap for `foo.es`.
