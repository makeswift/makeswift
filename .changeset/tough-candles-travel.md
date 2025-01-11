---
'@makeswift/controls': patch
'@makeswift/runtime': patch
---

### New `Font` control

We now have a `Font` control. This control let's you select a `fontFamily`, `fontStyle`, and `fontWeight`.
The values available are sourced from our Google Fonts integration within Makeswift and from the variants you pass to `getFonts` in your [`MakeswiftApiHandler`](https://docs.makeswift.com/developer/reference/makeswift-api-handler).

Available params for the Font control include:

- `label?: string`
  - Text for the panel label in the Makeswift builder.
- `variant?: boolean = true`
  - Config for whether `fontStyle` and `fontWeight` are included in the final value. Defaults to `true`.
    This value changes what panel inputs are shown in the Makeswift builder, and changes the type of `defaultValue`.
- `defaultValue?: variant extends false ? { fontFamily: string } : { fontFamily: string, fontStyle: 'normal' | 'italic', fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 }`
  - The default value passed to your component when no value is available. Without `defaultValue` the data passed to your component is optional.

### Example Usage

This example will explain how to use the `Font` control for a font whose `fontFamily` is stored within a CSS variable.

#### Root layout

We need to import a font within our root layout. In this example I am using `next/font`.

```tsx
import { Grenze_Gotisch, Grenze } from 'next/font/google'

import '@/app/global.css'
import '@/makeswift/components'

const GrenzeGotischFont = Grenze_Gotisch({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-grenze-gotisch',
})

export default async function RootLayout() {
  return <html className={GrenzeGotischFont.variable}>{/* ... */}</html>
}
```

#### Makeswift route handler

Then we need to add this font within our Makeswift route handler `getFonts` option in `./src/app/api/makeswift/[...makeswift]/route.ts`.

```ts
import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

const handler = MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY, {
  getFonts() {
    return [
      {
        family: 'var(--font-grenze-gotisch)',
        label: 'Grenze Gotisch',
        variants: [
          {
            weight: '400',
            style: 'normal',
          },
          {
            weight: '500',
            style: 'normal',
          },
          {
            weight: '700',
            style: 'normal',
          },
          {
            weight: '900',
            style: 'normal',
          },
        ],
      },
    ]
  },
})

export { handler as GET, handler as POST }
```

#### Component:

Now we can create a component that specifies font attributes.

```tsx
import { Ref, forwardRef } from 'react'

type Props = {
  className?: string
  font: {
    fontFamily: string
    fontStyle: string
    fontWeight: number
  }
  text?: string
}

export const MyComponent = forwardRef(function MyComponent(
  {
    className,
    font
    text,
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={className}
      ref={ref}
      style={{ ...font }}
    >
      {text ?? 'My Component'}
    </div>
  )
})

export default MyComponent
```

#### Component registration:

And finally we can register our component with Makeswift.
Note since our component's `font` prop isn't optional we must pass a `defaultValue`

```tsx
import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, Font, TextInput } from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./my-component')),
  {
    type: 'Font Control Demo',
    label: 'My Component',
    props: {
      className: Style(),
      font: Font({
        defaultValue: {
          fontFamily: 'var(--font-grenze-gotisch)',
          fontStyle: 'normal',
          fontWeight: 700,
        },
      }),
      text: TextInput(),
    },
  },
)
```

Now you can visually control fonts outside of `RichText`.
