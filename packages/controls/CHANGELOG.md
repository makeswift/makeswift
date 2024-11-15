# @makeswift/controls

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
