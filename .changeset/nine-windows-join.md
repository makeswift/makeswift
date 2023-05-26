---
"@makeswift/runtime": minor
---

BREAKING: When registering component icons, use the `ComponentIcon` enum (available under `@makeswift/runtime`) instead of the original string values. Below is a table of the deprecated string values and their new enum equivalent:

| Removed           | Use Instead (enum)          |
|-------------------|-----------------------------|
| `'Carousel40'`    | `ComponentIcon.Carousel`    |
| `'Code40'`        | `ComponentIcon.Code`        |
| `'Countdown40'`   | `ComponentIcon.Countdown`   |
| `'Cube40'`        | `ComponentIcon.Cube`        |
| `'Divider40'`     | `ComponentIcon.Divider`     |
| `'Form40'`        | `ComponentIcon.Form`        |
| `'Navigation40'`  | `ComponentIcon.Navigation`  |
| `'SocialLinks40'` | `ComponentIcon.SocialLinks` |
| `'Video40'`       | `ComponentIcon.Video`       |
