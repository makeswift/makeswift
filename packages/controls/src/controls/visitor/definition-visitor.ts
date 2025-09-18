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
import { RichTextDefinition, RichTextV1Definition } from '../rich-text'
import { SelectConfig, SelectDefinition } from '../select'
import { ShapeDefinition } from '../shape'
import { SlotDefinition } from '../slot'
import { StyleDefinition, StyleV2Definition } from '../style'
import { TextAreaDefinition } from '../text-area'
import { TextInputDefinition } from '../text-input'
import { unstable_TypographyDefinition } from '../typography'

abstract class ControlDefinitionVisitor<R> {
  abstract visitCheckbox(def: CheckboxDefinition, ...args: unknown[]): R
  abstract visitColor(def: ColorDefinition, ...args: unknown[]): R
  abstract visitCombobox(def: ComboboxDefinition, ...args: unknown[]): R
  abstract visitFont(def: FontDefinition, ...args: unknown[]): R
  abstract visitGroup(def: GroupDefinition, ...args: unknown[]): R
  abstract visitIconRadioGroup<C extends IconRadioGroupConfig>(
    def: IconRadioGroupDefinition<C>,
    ...args: unknown[]
  ): R

  abstract visitImage<C extends ImageConfig>(
    def: ImageDefinition<C>,
    ...args: unknown[]
  ): R

  abstract visitLink(def: LinkDefinition<any>, ...args: unknown[]): R
  abstract visitList(def: ListDefinition, ...args: unknown[]): R
  abstract visitNumber(def: NumberDefinition, ...args: unknown[]): R
  abstract visitRichTextV1(
    def: RichTextV1Definition<unknown, any>,
    ...args: unknown[]
  ): R

  abstract visitRichTextV2(
    def: RichTextDefinition<unknown, any>,
    ...args: unknown[]
  ): R

  abstract visitSelect<C extends SelectConfig>(
    def: SelectDefinition<C>,
    ...args: unknown[]
  ): R

  abstract visitShape(def: ShapeDefinition, ...args: unknown[]): R
  abstract visitSlot<RuntimeNode>(
    def: SlotDefinition<RuntimeNode>,
    ...args: unknown[]
  ): R

  abstract visitStyleV1(def: StyleDefinition, ...args: unknown[]): R
  abstract visitStyleV2(
    def: StyleV2Definition<ControlDefinition, unknown>,
    ...args: unknown[]
  ): R

  abstract visitTextArea(def: TextAreaDefinition, ...args: unknown[]): R
  abstract visitTextInput(def: TextInputDefinition, ...args: unknown[]): R
  abstract visitTypography(
    def: unstable_TypographyDefinition,
    ...args: unknown[]
  ): R
}

export { ControlDefinitionVisitor }
