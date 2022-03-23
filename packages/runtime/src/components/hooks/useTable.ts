import { useQuery } from '../../api/react'
import { TABLE_BY_ID } from '../utils/queries'

export type SingleLineTextTableColumn = {
  id: string
  name: string
  __typename: 'SingleLineTextTableColumn'
}

export type LongTextTableColumn = {
  id: string
  name: string
  __typename: 'LongTextTableColumn'
}

export type CheckboxTableColumn = {
  id: string
  name: string
  __typename: 'CheckboxTableColumn'
}

export type MultipleSelectTableColumnOption = {
  id: string
  name: string
}

export type MultipleSelectTableColumn = {
  id: string
  name: string
  options: Array<MultipleSelectTableColumnOption>
  __typename: 'MultipleSelectTableColumn'
}

export type SingleSelectTableColumnOption = {
  id: string
  name: string
}

export type SingleSelectTableColumn = {
  id: string
  name: string
  options: Array<SingleSelectTableColumnOption>
  __typename: 'SingleSelectTableColumn'
}

export type PhoneNumberTableColumn = {
  id: string
  name: string
  __typename: 'PhoneNumberTableColumn'
}

export type EmailTableColumn = {
  id: string
  name: string
  __typename: 'EmailTableColumn'
}

export type URLTableColumn = {
  id: string
  name: string
  __typename: 'URLTableColumn'
}

export type NumberTableColumn = {
  id: string
  name: string
  __typename: 'NumberTableColumn'
}

export type TableColumn =
  | SingleLineTextTableColumn
  | LongTextTableColumn
  | CheckboxTableColumn
  | MultipleSelectTableColumn
  | SingleSelectTableColumn
  | PhoneNumberTableColumn
  | EmailTableColumn
  | URLTableColumn
  | NumberTableColumn

type Table = {
  id: string
  name: string
  columns: Array<TableColumn>
}

export function useTable(tableId: string | null | undefined) {
  return useQuery<{ table: Table | null }>(TABLE_BY_ID, {
    skip: tableId == null,
    variables: { id: tableId },
  })
}
