import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { LinkDefinition } from '../../../controls'

import { useResolvedValue } from '../hooks/use-resolved-value'

export function useLinkControlValue(
  link: DataType<LinkDefinition> | undefined,
  definition: LinkDefinition,
): ResolvedValueType<LinkDefinition> {
  return useResolvedValue(link, (link, resourceResolver) =>
    definition.resolveValue(link, resourceResolver),
  )
}
