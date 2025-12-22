import { mapValues } from '../../lib/functional'

import { Data } from '../../common'
import { MergeTranslatableDataContext } from '../../context'

import { DataType } from '../associated-types'
import { CheckboxDefinition } from '../checkbox'
import { ColorDefinition } from '../color'
import { ComboboxDefinition } from '../combobox'
import { ControlDefinition } from '../definition'
import { FontDefinition } from '../font'
import { GroupDefinition } from '../group'
import {
  IconRadioGroupConfig,
  IconRadioGroupDefinition,
} from '../icon-radio-group'
import { ImageConfig, ImageDefinition } from '../image'
import { LinkDefinition } from '../link'
import { ListDefinition } from '../list'
import { NumberDefinition } from '../number'
import { RichTextV1Definition } from '../rich-text'
import { SelectConfig, SelectDefinition } from '../select'
import { ShapeDefinition } from '../shape'
import { SlotDefinition } from '../slot'
import { StyleDefinition, StyleV2Definition } from '../style'
import { TextAreaDefinition } from '../text-area'
import { TextInputDefinition } from '../text-input'
import { unstable_TypographyDefinition } from '../typography'

import { ControlDefinitionVisitor } from './definition-visitor'

abstract class MergeTranslationsVisitor extends ControlDefinitionVisitor<Data> {
  ctx: MergeTranslatableDataContext

  constructor(ctx: MergeTranslatableDataContext) {
    super()
    this.ctx = ctx
  }

  private noOpMerge(data: Data, _translatedData: Data): Data {
    return data
  }

  private defaultMerge(data: Data, translatedData: Data): Data {
    if (data == null || translatedData == null) return data
    return translatedData
  }

  visitCheckbox(
    _def: CheckboxDefinition,
    data: DataType<CheckboxDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitColor(
    _def: ColorDefinition,
    data: DataType<ColorDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitCombobox(
    _def: ComboboxDefinition,
    data: DataType<ComboboxDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitFont(
    _def: FontDefinition,
    data: DataType<FontDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitGroup(
    def: GroupDefinition,
    data: DataType<GroupDefinition> | undefined,
    translatedData: Record<string, Data>,
  ): Data {
    if (data == null || translatedData == null) return data

    const propsData = GroupDefinition.propsData(data)

    return mapValues(def.propDefs, (def, key) =>
      def.accept(this, propsData[key], translatedData[key]),
    )
  }

  visitIconRadioGroup<C extends IconRadioGroupConfig>(
    _def: IconRadioGroupDefinition<C>,
    data: DataType<IconRadioGroupDefinition<C>> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitImage<C extends ImageConfig>(
    _def: ImageDefinition<C>,
    data: DataType<ImageDefinition<C>> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitLink(
    _def: LinkDefinition,
    data: DataType<LinkDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.defaultMerge(data, translatedData)
  }

  visitList(
    def: ListDefinition,
    data: DataType<ListDefinition> | undefined,
    translatedData: Record<string, Data>,
  ): Data {
    if (data == null || translatedData == null) return data
    return data.map((item) => {
      return {
        ...item,
        value: def.itemDef.accept(this, item.value, translatedData[item.id]),
      }
    })
  }

  visitNumber(
    _def: NumberDefinition,
    data: DataType<NumberDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitRichTextV1(
    _def: RichTextV1Definition<unknown, any>,
    data: DataType<RichTextV1Definition<unknown, any>> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitSelect<C extends SelectConfig>(
    _def: SelectDefinition<C>,
    data: DataType<SelectDefinition<C>> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitShape(
    def: ShapeDefinition,
    data: DataType<ShapeDefinition> | undefined,
    translatedData: Record<string, Data>,
  ): Data {
    if (data == null || translatedData == null) return data
    return mapValues(def.keyDefs, (def, key) =>
      def.accept(this, data[key], translatedData[key]),
    )
  }

  visitSlot<RuntimeNode>(
    _def: SlotDefinition<RuntimeNode>,
    data: DataType<SlotDefinition<RuntimeNode>> | undefined,
    _translatedData: Data,
  ): Data {
    if (data == null) return data
    return {
      ...data,
      elements: data.elements.map((element) =>
        this.ctx.mergeTranslatedData(element),
      ),
    }
  }

  visitStyleV1(
    _def: StyleDefinition,
    data: DataType<StyleDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitStyleV2(
    _def: StyleV2Definition<ControlDefinition, unknown>,
    data: DataType<StyleV2Definition<ControlDefinition, unknown>> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }

  visitTextInput(
    _def: TextInputDefinition,
    data: DataType<TextInputDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.defaultMerge(data, translatedData)
  }

  visitTextArea(
    _def: TextAreaDefinition,
    data: DataType<TextAreaDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.defaultMerge(data, translatedData)
  }

  visitTypography(
    _def: unstable_TypographyDefinition,
    data: DataType<unstable_TypographyDefinition> | undefined,
    translatedData: Data,
  ): Data {
    return this.noOpMerge(data, translatedData)
  }
}

export { MergeTranslationsVisitor }
