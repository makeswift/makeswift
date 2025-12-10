# @makeswift/controls

## 0.1.16

### Patch Changes

- dac927f: Force build in prepublishing step to ignore any stale build outputs

## 0.1.15

### Patch Changes

- 6f2a4e7: Remove control serialization from the control definition interface, move towards supporting serialization via a visitor
- f7e8365: Supports plugins for deserialization. Also relocates function serialization/deserialization utilities to the runtime package.
- 846a8bf: Fix missing source maps for controls package

## 0.1.14

### Patch Changes

- 6408396: Remove translatable data merging from controls in favor of visitor pattern

## 0.1.13

### Patch Changes

- 3eaad67: fix: check null data before attempting to merge translated data
- 4c008a2: fix: support optional values for list control item data type

## 0.1.12

### Patch Changes

- a7d459d: Add optional description prop for `MakeswiftComponent`.
- f8f5d9a: Add support for optional descriptions when creating controls.

## 0.1.11

### Patch Changes

- ddb1450: Finetune clearing typography data on copy to only clear the resource reference, rather than any data.

## 0.1.10

### Patch Changes

- f8720ba: Allow tree data from copying a typography to include an undefined id

## 0.1.9

### Patch Changes

- f33c4d7: Add support for removing resources while copying control/prop-controller data with a replacement context

## 0.1.8

### Patch Changes

- 0988af6: chore: move the rest of breakpoint algorithms to the `@makeswift/controls` package

## 0.1.7

### Patch Changes

- 0e503bb: New `Group` control:

  ### New `Group` control

  We are introducing a new control called `Group`, designed to be a more versatile replacement for the `Shape` control, which has been deprecated and will be removed in a future release.

  The `Group` control offers an improved visual hierarchy for grouped controls when rendered in the Makeswift builder, along with new options for specifying the group label and preferred layout.

  The `Group` control options are:
  - `label?: string = "Group"`
    - The label for the group panel in the Makeswift builder. Defaults to `"Group"`.

  - `preferredLayout?: Group.Layout.Inline | Group.Layout.Popover = Group.Layout.Popover`
    - The preferred layout for the group in the Makeswift builder. Note that the builder may override this preference to optimize the user experience. Possible values include:
      - `Group.Layout.Inline`: Renders the group properties within the parent panel, visually grouping them to reflect the hierarchy. This is the default if no explicit value is provided.
      - `Group.Layout.Popover`: Renders the group properties in a standalone popover panel.

  - `props: Record<string, ControlDefinition>`
    - An object record defining the controls being grouped. This can include any of the Makeswift controls, including other groups. For example:

    ```typescript
    Group({
      props: {
        text: Color({ label: "Text" }),
        background: Color({ label: "Background" }),
        dismissable: Checkbox({ label: "Can be dismissed?" }),
      },
    });
    ```

  For full documentation, visit the [`Group` control reference page](https://docs.makeswift.com/developer/reference/controls/group).

- 8d9a47b: New `Font` control:

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
  import { Grenze_Gotisch, Grenze } from "next/font/google";

  import "@/app/global.css";
  import "@/makeswift/components";

  const GrenzeGotischFont = Grenze_Gotisch({
    subsets: ["latin"],
    weight: ["400", "500", "700", "900"],
    variable: "--font-grenze-gotisch",
  });

  export default async function RootLayout() {
    return <html className={GrenzeGotischFont.variable}>{/* ... */}</html>;
  }
  ```

  #### Makeswift route handler

  Then we need to add this font within our Makeswift route handler `getFonts` option in `./src/app/api/makeswift/[...makeswift]/route.ts`.

  ```ts
  import { MAKESWIFT_SITE_API_KEY } from "@/makeswift/env";
  import { MakeswiftApiHandler } from "@makeswift/runtime/next/server";

  const handler = MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY, {
    getFonts() {
      return [
        {
          family: "var(--font-grenze-gotisch)",
          label: "Grenze Gotisch",
          variants: [
            {
              weight: "400",
              style: "normal",
            },
            {
              weight: "500",
              style: "normal",
            },
            {
              weight: "700",
              style: "normal",
            },
            {
              weight: "900",
              style: "normal",
            },
          ],
        },
      ];
    },
  });

  export { handler as GET, handler as POST };
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
  import { runtime } from "@/makeswift/runtime";
  import { lazy } from "react";

  import { Style, Font, TextInput } from "@makeswift/runtime/controls";

  runtime.registerComponent(
    lazy(() => import("./my-component")),
    {
      type: "Font Control Demo",
      label: "My Component",
      props: {
        className: Style(),
        font: Font({
          defaultValue: {
            fontFamily: "var(--font-grenze-gotisch)",
            fontStyle: "normal",
            fontWeight: 700,
          },
        }),
        text: TextInput(),
      },
    },
  );
  ```

  Now you can visually control fonts outside of `RichText`.

## 0.1.6

### Patch Changes

- 11ae3c2: refactor: rewrite element tree rendering using "unified" controls interface

## 0.1.5

### Patch Changes

- da076ce: fix: stalled calls/memory leaks on repeated function deserialization

## 0.1.4

### Patch Changes

- e2eb5d6: fix: `Shape` control iterates through definition instead of data/value keys

## 0.1.3

### Patch Changes

- 1081caa: refactor: move basic controls' value resolution to the new `resolveValue` method
- 4d82ccd: refactor: move `is`, `deepEqual` and `shallowEqual` predicates to the `@makeswift/controls` package

## 0.1.2

### Patch Changes

- be118e6: fixes `Shape` introspection and copying to properly handle non-existent/orphaned props.

## 0.1.1

### Patch Changes

- 5cfd1af: Relax `Select` options schema to allow values that can be coerced to a string.

## 0.1.0

### Minor Changes

- 30a7c9b: This change converts our control definitions to active classes, each with
  encapsulated implementations for control serialization/deserialization, data and
  value parsing, copying, and other core operations for controls.

  In addition, base definitions of all controls, as well as several shared
  types/schemas, have now been defined in this package.

  ## BREAKING:
  1. Several types and utilities associated with controls have been removed as part of
     this change. As an example, let's look over the types/functions associated with
     the `Color` control (keep in mind that this applies to all controls, not just
     `Color`):
     - `ColorControlType`: a string literal identifying the `Color` control
     - `ColorControlDataTypeValueV1` - a string literal identifying V1 Color control
       data.
     - `ColorControlDataTypeKey`: a string literal defining the key in which the V1
       data signature for the Color control is stored in.
     - `ColorControlDataV0` / `ColorControlDataV1` - types describing the data format
       of the color control, depending on the version of the definition.
     - `ColorControlData` - describes the data format for a `Color` control. In this
       case, it is a union of type definitions for `ColorControlDataV0` and
       `ColorControlDataV1`
     - `ColorControlDefinition` - describes the type of the `Color` control
       definition, namely its type and config options
     - `copyColorData` - Creates a copy of a given `ColorControlData`, given a copy
       context.

     All of these have been removed. Most of them have been replaced by
     functionality available on the `ColorDefinition` active class. Let's see how
     we can use this class to achieve the functionality of the removed constructs
     above:

     ```typescript
     import { type DataType, Color, ColorDefinition } from '@makeswift/controls`

     const color = Color({ defaultValue: "red" })

     // Accessing config information:
     console.log(color.config)

     type ColorControlType = ColorDefinition['controlType']

     type ColorControlData = DataType<ColorDefinition> // a union of V1 and V0 data

     // Copying Data:
     color.copyData({ swatchId: '###', alpha: 1 }, ...)
     ```

     Note the use of the `DataType` type, which can infer the data type given a
     control definition. Also note that the `copyData` method is defined on an
     instance of a color, rather than a standalone function.

## 0.0.1

### Patch Changes

- 2b14406: Separate many controls into a @makeswift/controls package.
