import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { JSXConvertersFunction, LinkJSXConverter } from '@payloadcms/richtext-lexical/react'

import { headingConverter } from '@/components/rich-text/converters/heading-converter'
import { internalDocToHref } from '@/components/rich-text/converters/internal-link'

type NodeTypes = DefaultNodeTypes

export const jsxConverter: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...headingConverter,
})
