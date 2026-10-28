export type SingleLineTextTableColumn = {
  id: string
  name: string
  type: 'SingleLineTextTableColumn'
}

export type LongTextTableColumn = {
  id: string
  name: string
  type: 'LongTextTableColumn'
}

export type CheckboxTableColumn = {
  id: string
  name: string
  type: 'CheckboxTableColumn'
}

export type MultipleSelectTableColumnOption = {
  id: string
  name: string
}

export type MultipleSelectTableColumn = {
  id: string
  name: string
  options: Array<MultipleSelectTableColumnOption>
  type: 'MultipleSelectTableColumn'
}

export type SingleSelectTableColumnOption = {
  id: string
  name: string
}

export type SingleSelectTableColumn = {
  id: string
  name: string
  options: Array<SingleSelectTableColumnOption>
  type: 'SingleSelectTableColumn'
}

export type PhoneNumberTableColumn = {
  id: string
  name: string
  type: 'PhoneNumberTableColumn'
}

export type EmailTableColumn = {
  id: string
  name: string
  type: 'EmailTableColumn'
}

export type URLTableColumn = {
  id: string
  name: string
  type: 'URLTableColumn'
}

export type NumberTableColumn = {
  id: string
  name: string
  type: 'NumberTableColumn'
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

export type Table = {
  id: string
  name: string
  columns: Array<TableColumn>
}
