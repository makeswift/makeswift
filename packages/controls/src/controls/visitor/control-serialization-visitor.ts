import {
  SerializationPlugin,
  SerializedRecord,
  serializeObject,
} from '../../serialization'

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

import { ControlDefinitionVisitor } from './definition-visitor'

export abstract class ControlSerializationVisitor extends ControlDefinitionVisitor<SerializedRecord> {
  constructor(
    protected readonly serializationPlugins: SerializationPlugin<any>[] = [],
  ) {
    super()
  }

  private serializeConfig(
    def: ControlDefinition,
    rest: Record<string, unknown> = {},
  ) {
    const serialized = serializeObject(def.config, this.serializationPlugins)
    return {
      config: serialized,
      type: def.controlType,
      ...rest,
    } as unknown as SerializedRecord
  }

  visitCheckbox(def: CheckboxDefinition): SerializedRecord {
    return this.serializeConfig(def, { version: def.version })
  }
  visitColor(def: ColorDefinition): SerializedRecord {
    return this.serializeConfig(def, { version: def.version })
  }
  visitCombobox(def: ComboboxDefinition): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitFont(def: FontDefinition): SerializedRecord {
    return this.serializeConfig(def, { version: def.version })
  }
  visitGroup(def: GroupDefinition): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitIconRadioGroup<C extends IconRadioGroupConfig>(
    def: IconRadioGroupDefinition<C>,
  ): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitImage<C extends ImageConfig>(def: ImageDefinition<C>): SerializedRecord {
    return this.serializeConfig(def, { version: def.version })
  }
  visitLink(def: LinkDefinition<any>): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitList(def: ListDefinition): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitNumber(def: NumberDefinition): SerializedRecord {
    return this.serializeConfig(def, { version: def.version })
  }
  visitRichTextV1(def: RichTextV1Definition<unknown, any>): SerializedRecord {
    return this.serializeConfig(def)
  }

  visitRichTextV2(def: RichTextDefinition<unknown, any>): SerializedRecord {
    return this.serializeConfig(def)
  }

  visitSelect<C extends SelectConfig>(
    def: SelectDefinition<C>,
  ): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitShape(def: ShapeDefinition): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitSlot<RuntimeNode>(def: SlotDefinition<RuntimeNode>): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitStyleV1(def: StyleDefinition): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitStyleV2(
    def: StyleV2Definition<ControlDefinition, unknown>,
  ): SerializedRecord {
    return this.serializeConfig(def)
  }
  visitTextInput(def: TextInputDefinition): SerializedRecord {
    return this.serializeConfig(def, { version: def.version })
  }
  visitTextArea(def: TextAreaDefinition): SerializedRecord {
    return this.serializeConfig(def, { version: def.version })
  }
  visitTypography(def: unstable_TypographyDefinition): SerializedRecord {
    return this.serializeConfig(def)
  }
}
