import { Group, Link, List, Number, Select, Style, TextInput } from '@makeswift/runtime/controls'
import { runtime } from 'lib/makeswift/runtime'

import { Navigation } from './client'

export const NAVIGATION_COMPONENT_TYPE = 'makeswift-navigation'

const links = List({
  label: 'Navigation Links',
  type: Group({
    label: 'Link',
    props: {
      label: TextInput({ label: 'Text', defaultValue: 'Home' }),
      link: Link({ label: 'URL' }),
    },
  }),
  getItemLabel: item => item?.label ?? 'Home',
})

const alignment = Select({
  label: 'Alignment',
  options: [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ],
  defaultValue: 'left',
})

const orientation = Select({
  label: 'Orientation',
  options: [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'vertical', label: 'Vertical' },
  ],
  defaultValue: 'horizontal',
})

const searchMaxResults = Number({
  label: 'Search initial results',
  defaultValue: 2,
  min: 1,
  max: 20,
  step: 1,
})

const searchPaginationLimit = Number({
  label: 'Search results per pagination',
  defaultValue: 2,
  min: 1,
  max: 10,
  step: 1,
})

const algoliaIndexName = TextInput({
  label: 'Algolia Index Name',
  defaultValue: '',
})

runtime.registerComponent(Navigation, {
  type: NAVIGATION_COMPONENT_TYPE,
  label: 'Navigation',
  icon: 'navigation',
  hidden: true,
  props: {
    className: Style(),
    links,
    alignment,
    orientation,
    searchMaxResults,
    searchPaginationLimit,
    algoliaIndexName,
  },
})
