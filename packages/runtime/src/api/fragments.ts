import { DocumentNode } from 'graphql'
import { APIResourceType } from './types'
import * as FragmentDocumentNodes from './graphql/generated/fragment-document-nodes'

export const Fragments: Record<APIResourceType, DocumentNode> = FragmentDocumentNodes
