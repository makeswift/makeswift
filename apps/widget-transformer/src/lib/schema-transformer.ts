// AI slop
/**
 * BigCommerce to Makeswift Control Type Mappings
 *
 * Supported BigCommerce Types (direct mapping):
 * - 'input' → TextInput (or Link if URL placeholder detected)
 * - 'text' → TextInput
 * - 'color' → Color
 * - 'number' → Number
 * - 'range' → Number (with step and suffix support)
 * - 'select' → Select
 * - 'checkbox'/'boolean' → Checkbox
 * - 'alignment' → Select (with horizontal/vertical/both options)
 * - 'imageManager' → Image
 * - 'typography' → Font
 *
 * Partially Supported Types (with limitations):
 * - 'code' → RichText (Note: BigCommerce supports HTML editing, Makeswift is rich text only)
 * - 'regexInput' → TextInput (Note: Makeswift doesn't support regex validation)
 * - 'boxModel' → Group (Note: Simulated with top/right/bottom/left Number controls)
 * - 'productId' → TextInput (Note: BigCommerce has product search, Makeswift is plain text)
 * - 'productImage' → Image (Note: BigCommerce has product-specific selection)
 * - 'elementSettings' → Group (Note: Complex nested configurations simplified)
 * - 'visibility' → Checkbox (Note: BigCommerce has advanced visibility options)
 * - 'array' → List (Note: Complex nested schemas simplified to basic structure)
 *
 * Unsupported BigCommerce Schema Features:
 * - Conditional settings (typeMeta.conditional)
 * - Advanced array configurations (defaultCount, thumbnail)
 * - Complex nested schema in arrays
 * - Product-specific controls integration
 * - Advanced typography options beyond font family/style/weight
 * - Box model with different units beyond px
 * - Regex pattern validation
 * - HTML code editing
 * - Advanced visibility rules
 * - Element-specific advanced settings
 */

import {
  TextInput,
  Color,
  Number,
  Select,
  Checkbox,
  Link,
  Image,
  RichText,
  List,
  Group,
  Font,
} from '@makeswift/runtime/controls'

interface BigCommerceSchemaItem {
  type: string
  id?: string
  label?: string
  default?: any
  typeMeta?: any
  settings?: Array<{
    id: string
    default?: any
    type?: string
    label?: string
  }>
}

export interface BigCommerceWidgetSchema {
  schema: Array<{
    type: string
    label?: string
    sections?: Array<{
      label: string
      settings: BigCommerceSchemaItem[]
    }>
    settings?: Array<{
      id: string
      default?: any
      type?: string
      label?: string
    }>
  }>
  [key: string]: any
}

/**
 * Transform BigCommerce widget schema to Makeswift controls
 */
export function transformSchemaToControls(
  widgetSchema: BigCommerceWidgetSchema,
) {
  const controls: Record<string, any> = {}

  function processSettings(
    settings: Array<{
      id: string
      type?: string
      label?: string
      default?: any
      typeMeta?: any
      settings?: any[]
    }>,
  ) {
    settings.forEach((setting) => {
      if (setting.type === 'hidden') return
      if (!setting.id) return

      switch (setting.type) {
        case 'input':
          if (setting.typeMeta?.placeholder?.includes('http')) {
            controls[setting.id] = Link({
              label: setting.label || setting.id,
              ...(setting.default && { defaultValue: setting.default }),
            })
          } else {
            controls[setting.id] = TextInput({
              label: setting.label || setting.id,
              ...(setting.default && { defaultValue: setting.default }),
            })
          }
          break

        case 'code':
        case 'text':
          controls[setting.id] = TextInput({
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: setting.default }),
          })
          break

        case 'color':
          controls[setting.id] = Color({
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: setting.default }),
          })
          break

        case 'number':
          controls[setting.id] = Number({
            label: setting.label || setting.id,
            ...(setting.default?.value && {
              defaultValue: setting.default.value,
            }),
            ...(setting.typeMeta?.min && { min: setting.typeMeta.min }),
            ...(setting.typeMeta?.max && { max: setting.typeMeta.max }),
          })
          break

        case 'range':
          controls[setting.id] = Number({
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: setting.default }),
            ...(setting.typeMeta?.rangeValues?.min && {
              min: setting.typeMeta.rangeValues.min,
            }),
            ...(setting.typeMeta?.rangeValues?.max && {
              max: setting.typeMeta.rangeValues.max,
            }),
            step: setting.typeMeta?.step || 1,
            suffix: setting.typeMeta?.unit || undefined,
          })
          break

        case 'select':
          if (setting.typeMeta?.selectOptions) {
            controls[setting.id] = Select({
              label: setting.label || setting.id,
              options: setting.typeMeta.selectOptions.map((option: any) => ({
                label: option.label,
                value: option.value,
              })),
              ...(setting.default && { defaultValue: setting.default }),
            })
          }
          break

        case 'checkbox':
        case 'boolean':
          controls[setting.id] = Checkbox({
            label: setting.label || setting.id,
            ...(setting.default !== undefined && {
              defaultValue: Boolean(setting.default),
            }),
          })
          break

        case 'alignment':
          if (setting.typeMeta?.display === 'horizontal') {
            controls[setting.id] = Select({
              label: setting.label || setting.id,
              options: [
                { label: 'Left', value: { horizontal: 'left' } },
                { label: 'Center', value: { horizontal: 'center' } },
                { label: 'Right', value: { horizontal: 'right' } },
              ],
              ...(setting.default && { defaultValue: setting.default }),
            })
          } else if (setting.typeMeta?.display === 'vertical') {
            controls[setting.id] = Select({
              label: setting.label || setting.id,
              options: [
                { label: 'Top', value: { vertical: 'top' } },
                { label: 'Middle', value: { vertical: 'middle' } },
                { label: 'Bottom', value: { vertical: 'bottom' } },
              ],
              ...(setting.default && { defaultValue: setting.default }),
            })
          } else {
            // Both horizontal and vertical alignment
            controls[setting.id] = Select({
              label: setting.label || setting.id,
              options: [
                {
                  label: 'Top Left',
                  value: { horizontal: 'left', vertical: 'top' },
                },
                {
                  label: 'Top Center',
                  value: { horizontal: 'center', vertical: 'top' },
                },
                {
                  label: 'Top Right',
                  value: { horizontal: 'right', vertical: 'top' },
                },
                {
                  label: 'Middle Left',
                  value: { horizontal: 'left', vertical: 'middle' },
                },
                {
                  label: 'Middle Center',
                  value: { horizontal: 'center', vertical: 'middle' },
                },
                {
                  label: 'Middle Right',
                  value: { horizontal: 'right', vertical: 'middle' },
                },
                {
                  label: 'Bottom Left',
                  value: { horizontal: 'left', vertical: 'bottom' },
                },
                {
                  label: 'Bottom Center',
                  value: { horizontal: 'center', vertical: 'bottom' },
                },
                {
                  label: 'Bottom Right',
                  value: { horizontal: 'right', vertical: 'bottom' },
                },
              ],
              ...(setting.default && { defaultValue: setting.default }),
            })
          }
          break

        case 'imageManager':
          controls[setting.id] = Image({
            label: setting.label || setting.id,
            ...(setting.default?.src && {
              defaultValue: {
                type: 'makeswift-file',
                url: setting.default.src,
              },
            }),
          })
          break

        case 'regexInput':
          // Use TextInput with pattern validation if supported
          controls[setting.id] = TextInput({
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: setting.default }),
            // Note: Makeswift TextInput doesn't support regex validation
          })
          break

        case 'typography':
          controls[setting.id] = Font({
            // Note: Makeswift Font control supports fontFamily, fontStyle, fontWeight
          })
          break

        // Unsupported BigCommerce types that don't have direct Makeswift equivalents:
        case 'boxModel':
          // No direct equivalent - use Group to simulate margin/padding controls
          controls[setting.id] = Group({
            label: setting.label || setting.id,
            props: {
              top: Number({ label: 'Top', suffix: 'px' }),
              right: Number({ label: 'Right', suffix: 'px' }),
              bottom: Number({ label: 'Bottom', suffix: 'px' }),
              left: Number({ label: 'Left', suffix: 'px' }),
            },
          })
          break

        case 'productId':
          // No direct product picker equivalent - use TextInput for product ID
          controls[setting.id] = TextInput({
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: setting.default }),
            // Note: BigCommerce 'productId' provides product search functionality
          })
          break

        case 'productImage':
          // No direct product image picker - use Image control
          controls[setting.id] = Image({
            label: setting.label || setting.id,
            // Note: BigCommerce 'productImage' provides product-specific image selection
          })
          break

        case 'elementSettings':
          // Complex nested settings - use Group
          controls[setting.id] = Group({
            label: setting.label || setting.id,
            props: {},
            // Note: BigCommerce 'elementSettings' supports complex nested configurations
          })
          break

        case 'visibility':
          // Use Checkbox to control visibility
          controls[setting.id] = Checkbox({
            label: setting.label || setting.id,
            ...(setting.default !== undefined && {
              defaultValue: Boolean(setting.default),
            }),
            // Note: BigCommerce 'visibility' controls element visibility with advanced options
          })
          break

        case 'array':
          // Use List control for arrays
          controls[setting.id] = List({
            label: setting.label || setting.id,
            type: Group({
              label: setting.typeMeta?.entryLabel || 'Item',
              props: {
                // Would need to process nested schema for array items
                value: TextInput({ label: 'Value' }),
              },
            }),
            // Note: BigCommerce 'array' supports complex nested schemas with defaultCount, entryLabel, thumbnail
          })
          break

        default:
          // For unsupported types, default to text
          controls[setting.id] = TextInput({
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: String(setting.default) }),
          })
      }
    })
  }

  widgetSchema.schema.forEach((section) => {
    if (section.settings) {
      processSettings(section.settings)
    }
    if (section.sections) {
      section.sections.forEach((subsection) => {
        if (subsection.settings) {
          processSettings(subsection.settings as any)
        }
      })
    }
  })

  return controls
}
