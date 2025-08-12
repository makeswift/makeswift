# @makeswift/prop-controllers

## 0.4.6-canary.2

### Patch Changes

- 2ec2608: fix: support null swatch IDs for backgrounds prop controller color data

## 0.4.6-canary.1

### Patch Changes

- 2135f65: fix: `backgrounds` control replaces/introspects video background swatch

## 0.4.6-canary.0

### Patch Changes

- 50eb563: fix: `navigation-links` control replaces/introspects all swatches

## 0.4.5

### Patch Changes

- Updated dependencies [a7d459d]
- Updated dependencies [f8f5d9a]
  - @makeswift/controls@0.1.12

## 0.4.4

### Patch Changes

- Updated dependencies [ddb1450]
  - @makeswift/controls@0.1.11

## 0.4.3

### Patch Changes

- Updated dependencies [f8720ba]
  - @makeswift/controls@0.1.10

## 0.4.2

### Patch Changes

- f33c4d7: Add support for removing resources while copying control/prop-controller data with a replacement context
- Updated dependencies [f33c4d7]
  - @makeswift/controls@0.1.9

## 0.4.1

### Patch Changes

- Updated dependencies [0988af6]
  - @makeswift/controls@0.1.8

## 0.4.0

### Minor Changes

- 691be81: fix: correct typo in introspection method: `getResponsiveColorPropControllerDataSawtchIds` -> `getResponsiveColorPropControllerDataSwatchIds`

### Patch Changes

- Updated dependencies [0e503bb]
- Updated dependencies [8d9a47b]
  - @makeswift/controls@0.1.7

## 0.3.7

### Patch Changes

- Updated dependencies [11ae3c2]
  - @makeswift/controls@0.1.6

## 0.3.6

### Patch Changes

- Updated dependencies [da076ce]
  - @makeswift/controls@0.1.5

## 0.3.5

### Patch Changes

- Updated dependencies [e2eb5d6]
  - @makeswift/controls@0.1.4

## 0.3.4

### Patch Changes

- Updated dependencies [1081caa]
- Updated dependencies [4d82ccd]
  - @makeswift/controls@0.1.3

## 0.3.3

### Patch Changes

- Updated dependencies [be118e6]
  - @makeswift/controls@0.1.2

## 0.3.2

### Patch Changes

- Updated dependencies [5cfd1af]
  - @makeswift/controls@0.1.1

## 0.3.1

### Patch Changes

- 30a7c9b: Refactored package to use common types and schemas defined in the
  `@makeswift/controls` package.
- Updated dependencies [30a7c9b]
  - @makeswift/controls@0.1.0

## 0.3.0

### Minor Changes

- b7a2a4c: Add data type to legacy `TextInput` prop controller and move it to `@makeswift/prop-controllers`.
- c65e6a8: Add data type to legacy `ResponsiveSelect` prop controller, move it to `@makeswift/prop-controllers`
- 8f019cd: Add data type to legacy `ResponsiveNumber` prop controller, move it to `@makeswift/prop-controllers`
- f32d402: Add data type to legacy `SocialLinks` prop controller and move it to `@makeswift/prop-controllers`.
- 7d05094: Add data type to legacy `ResponsiveOpacity` prop controller and move it to `@makeswift/prop-controllers`.

### Patch Changes

- 2ac496f: Add data type to legacy `ResponsiveIconRadioGroup` prop controller, move it to `@makeswift/prop-controllers`

## 0.2.1

### Patch Changes

- 9a439d5: Update `BackgroundsDescriptorV1` version field to be optional to match previous behavior.

## 0.2.0

### Minor Changes

- f5c3617: Add data type to legacy `TableFormFields` prop controller and move it to `@makeswift/prop-controllers`.
- bb82576: Add data type to legacy `Image` prop controller and move it to `@makeswift/prop-controllers`.
- 860f92a: Add data type to legacy `Backgrounds` prop controller and move it to `@makeswift/prop-controllers`.
- 61d43cc: Add data type to legacy `Images` prop controller and move it to `@makeswift/prop-controllers`.
- 092784c: Add data type to legacy `ElementID` prop controller and move it to `@makeswift/prop-controllers`.
- 87e1665: Add data type to legacy `Grid` prop controller and move it to `@makeswift/prop-controllers`.

### Patch Changes

- 4b0d47c: Use correct copy method for ElementID.
- 4d38a0b: Fix v2 data values not properly transformed for `ResponsiveValue` option.

## 0.1.1

### Patch Changes

- a64a640: Use `turbo` in prepublishing step to automatically build dependencies as needed

## 0.1.0

### Minor Changes

- cf79dcb: Add data type to legacy `ResponsiveLength` prop controller and move it to `@makeswift/prop-controllers`.
- 89a6d77: Add data type to legacy `BorderRadius` prop controller and move it to `@makeswift/prop-controllers`.
- 5bd9b5f: Add data type to legacy `Shadows` prop controller and move it to `@makeswift/prop-controllers`.
- 0a9a89c: Add data type to legacy `ResponsiveColor` prop controller and move it to `@makeswift/prop-controllers`.
- 4847f1b: Add data type to legacy `Checkbox` prop controller and move it to `@makeswift/prop-controllers`.
- 38f8798: Add data type to legacy `Border` prop controller and move it to `@makeswift/prop-controllers`.
- b5fe83a: Add data type to legacy `Date` prop controller and move it to `@makeswift/prop-controllers`.
- c37a850: Add data type to legacy `Number` prop controller and move it to `@makeswift/prop-controllers`.
- 6b62ab6: Add Zod to `@makeswift/prop-controllers` and schemas for legacy Shadows prop controller.

### Patch Changes

- 24f76a8: Add data type to legacy `TextStyle` prop controller and move it to `@makeswift/prop-controllers`.
- 6bab3df: Add data type to legacy `GapY` prop controller and move it to `@makeswift/prop-controllers`.
- 9b61ad8: Add data type to legacy `NavigationLinks` prop controller and move it to `@makeswift/prop-controllers`.
- 2602000: Add data type to `LinkPropController`.
- 045799d: Add data type to legacy `Width` prop controller and move it to `@makeswift/prop-controllers`.
- abf95d6: Add data type to legacy `Margin` prop controller and move it to `@makeswift/prop-controllers`.
- bc036af: Add data type to legacy `Font` prop controller and move it to `@makeswift/prop-controllers`.
- f377f89: Add data type to legacy `Table` prop controller and move it to `@makeswift/prop-controllers`.
- fe5c346: Add data type to legacy `GapX` prop controller and move it to `@makeswift/prop-controllers`.
- 6e48054: Add data type to legacy `Video` prop controller and move it to `@makeswift/prop-controllers`.
- a909fa1: Add a new `@makeswift/prop-controllers` package that contains deprecated prop-controllers. This package is intended for internal use only.
- f7fc53e: Add data type to legacy `Padding` prop controller and move it to `@makeswift/prop-controllers`.
- df976f6: Add data type to legacy `TextArea` prop controller and move it to `@makeswift/prop-controllers`.
