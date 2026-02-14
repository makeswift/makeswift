import { createReadOnlyTestStore } from './test-store'

import { Group, List, Slot, TextInput } from '../../controls'
import { registerComponent } from '../actions/internal/read-only-actions'
import * as TranslationFixtures from './fixtures/translations'
import { ComponentIcon } from '../modules/components-meta'
import { getPropControllerDescriptors } from '../read-only-state'
import { mergeElementTreeTranslatedData } from '../translations/merge'

const ElementType = {
  Box: 'box',
  Button: 'button',
  Accordion: 'accordion',
  SlotList: 'slot-list',
} as const

type ElementType = (typeof ElementType)[keyof typeof ElementType]

function createTestStore() {
  const store = createReadOnlyTestStore()

  store.dispatch(
    registerComponent(
      ElementType.Box,
      { label: 'Box', icon: ComponentIcon.Cube, hidden: false },
      { children: Slot() },
    ),
  )

  store.dispatch(
    registerComponent(
      ElementType.Button,
      { label: 'Button', icon: ComponentIcon.Cube, hidden: false },
      { children: TextInput() },
    ),
  )

  store.dispatch(
    registerComponent(
      ElementType.Accordion,
      { label: 'Accordion', icon: ComponentIcon.Cube, hidden: false },
      {
        items: List({
          type: Group({
            props: {
              title: TextInput({ defaultValue: 'Default Title' }),
              content: Slot(),
            },
          }),
        }),
      },
    ),
  )

  store.dispatch(
    registerComponent(
      ElementType.SlotList,
      { label: 'Slot List', icon: ComponentIcon.Cube, hidden: false },
      { items: List({ type: Slot() }) },
    ),
  )

  return store
}

describe('mergeTranslatedData', () => {
  const store = createTestStore()

  test('Translates element tree with composable controls and slots', () => {
    // Act
    const result = mergeElementTreeTranslatedData(
      getPropControllerDescriptors(store.getState()),
      TranslationFixtures.accordionFullTree.preTranslation,
      TranslationFixtures.accordionFullTree.translationDto,
    )

    // Assert
    expect(result).toEqual(TranslationFixtures.accordionFullTree.postTranslation)
  })

  test('Translates element trees with partial values (unset list items)', () => {
    // Act
    const result = mergeElementTreeTranslatedData(
      getPropControllerDescriptors(store.getState()),
      TranslationFixtures.accordionPartialTree.preTranslation,
      TranslationFixtures.accordionPartialTree.translationDto,
    )

    // Assert
    expect(result).toEqual(TranslationFixtures.accordionPartialTree.postTranslation)
  })
})
