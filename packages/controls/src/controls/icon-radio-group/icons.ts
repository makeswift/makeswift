/**
 * The full set of icons available to the `IconRadioGroup` control.
 *
 * Keys and values are the same public icon name (e.g. `AlignLeft`). The runtime
 * is intentionally decoupled from the builder's icon component filenames — the
 * builder maps these names to its own icons (e.g. `AlignLeft` -> `AlignLeft16`),
 * the same way Component Icons are handled.
 */
export const icons = {
  AlignCenter: 'AlignCenter',
  AlignLeft: 'AlignLeft',
  AlignRight: 'AlignRight',
  ArrowCenter: 'ArrowCenter',
  ArrowDown: 'ArrowDown',
  ArrowInside: 'ArrowInside',
  ArrowOutside: 'ArrowOutside',
  AspectStandard: 'AspectStandard',
  AspectWide: 'AspectWide',
  BorderDashed: 'BorderDashed',
  BorderDotted: 'BorderDotted',
  BorderSolid: 'BorderSolid',
  ButtonPill: 'ButtonPill',
  ButtonRounded: 'ButtonRounded',
  ButtonSquare: 'ButtonSquare',
  CaretDown: 'CaretDown',
  ChevronDown: 'ChevronDown',
  Code: 'Code',
  CountdownNaked: 'CountdownNaked',
  CountdownOutline: 'CountdownOutline',
  CountdownOutlineSplit: 'CountdownOutlineSplit',
  CountdownSolid: 'CountdownSolid',
  CountdownSolidSplit: 'CountdownSolidSplit',
  Dropdown: 'Dropdown',
  GradientLinear: 'GradientLinear',
  GradientRadial: 'GradientRadial',
  HeightAuto: 'HeightAuto',
  HeightMatch: 'HeightMatch',
  Moon: 'Moon',
  Percent: 'Percent',
  Plus: 'Plus',
  Px: 'Px',
  RadioButton: 'RadioButton',
  RepeatNone: 'RepeatNone',
  RepeatX: 'RepeatX',
  RepeatXy: 'RepeatXy',
  RepeatY: 'RepeatY',
  ShadowInner: 'ShadowInner',
  ShadowOuter: 'ShadowOuter',
  SizeLarge: 'SizeLarge',
  SizeMedium: 'SizeMedium',
  SizeSmall: 'SizeSmall',
  Star: 'Star',
  StarCircle: 'StarCircle',
  StarRoundedSquare: 'StarRoundedSquare',
  StarSquare: 'StarSquare',
  Subscript: 'Subscript',
  Sun: 'Sun',
  Superscript: 'Superscript',
  TextAlignCenter: 'TextAlignCenter',
  TextAlignJustify: 'TextAlignJustify',
  TextAlignLeft: 'TextAlignLeft',
  TextAlignRight: 'TextAlignRight',
  VerticalAlignEnd: 'VerticalAlignEnd',
  VerticalAlignMiddle: 'VerticalAlignMiddle',
  VerticalAlignSpaceBetween: 'VerticalAlignSpaceBetween',
  VerticalAlignStart: 'VerticalAlignStart',
} as const

/**
 * Icon ids serialized by runtimes from before icon names were decoupled from
 * the builder's `*16` component filenames. `deserialize` still accepts these so
 * panels (e.g. RichText) hosted on older runtimes keep rendering; the builder
 * maps them to its components.
 */
export const legacyIcons = {
  Code16: 'Code16',
  Subscript16: 'Subscript16',
  Superscript16: 'Superscript16',
} as const
