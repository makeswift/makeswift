import { DocumentNode } from 'graphql'
import { APIResourceType } from '..'
import * as FragmentDocumentNodes from './generated/fragment-document-nodes'

export const Fragments: Record<APIResourceType, DocumentNode> = FragmentDocumentNodes
