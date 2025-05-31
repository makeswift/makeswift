import React from 'react'
import { TextInput } from '@makeswift/runtime/controls'
import { runtime } from './runtime'

runtime.registerComponent(
  function MetaTags({ title }) {
    return <>{title && <title>{title}</title>}</>
  },
  {
    type: 'Meta Tags',
    label: 'Meta Tags',
    props: {
      title: TextInput({ label: 'Title' }),
    },
  },
)
