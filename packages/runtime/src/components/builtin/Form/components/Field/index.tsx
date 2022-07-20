import { useRef } from 'react'
import { Field as FormikField, getIn } from 'formik'

import SingleLineTextTableField from './components/SingleLineTextTableField'
import LongTextTableField from './components/LongTextTableField'
import CheckboxTableField from './components/CheckboxTableField'
import MultipleSelectTableField from './components/MultipleSelectTableField'
import SingleSelectTableField from './components/SingleSelectTableField'
import PhoneNumberTableField from './components/PhoneNumberTableField'
import EmailTableField from './components/EmailTableField'
import URLTableField from './components/URLTableField'
import NumberTableField from './components/NumberTableField'
import PlaceholderTableField from './components/PlaceholderTableField'
import { TableColumn } from '../../types'

function getTypeMismatchErrorMessage(tableColumn: TableColumn | null | undefined, label: string) {
  switch ((tableColumn || {}).__typename) {
    case 'PhoneNumberTableColumn':
      return `${label} field must be a valid phone number.`

    case 'EmailTableColumn':
      return `${label} field must be a valid email.`

    case 'URLTableColumn':
      return `${label} field must be a valid URL.`

    case 'NumberTableColumn':
      return `${label} field must be a valid number.`

    case 'SingleLineTextTableColumn':
    case 'LongTextTableColumn':
    case 'CheckboxTableColumn':
    default:
      return `${label} field is invalid.`
  }
}

function getTableColumnField(tableColumn: TableColumn | null | undefined) {
  switch ((tableColumn || {}).__typename) {
    case 'SingleLineTextTableColumn':
      return SingleLineTextTableField

    case 'LongTextTableColumn':
      return LongTextTableField

    case 'CheckboxTableColumn':
      return CheckboxTableField

    case 'MultipleSelectTableColumn':
      return MultipleSelectTableField

    case 'SingleSelectTableColumn':
      return SingleSelectTableField

    case 'PhoneNumberTableColumn':
      return PhoneNumberTableField

    case 'EmailTableColumn':
      return EmailTableField

    case 'URLTableColumn':
      return URLTableField

    case 'NumberTableColumn':
      return NumberTableField

    default:
      return SingleLineTextTableField
  }
}

type TableFormField = {
  id: string
  tableColumnId: string
  label?: string
  placeholder?: string
  required?: boolean
  hidden?: boolean
  type?: 'select' | 'radio'
  hideLabel?: boolean
}

type Props = {
  tableColumn: TableColumn | null | undefined
  tableFormField: TableFormField
}

export default function Field({
  tableColumn,
  tableFormField: {
    id,
    label = '',
    placeholder,
    required = false,
    hidden = false,
    type = 'radio',
    hideLabel = false,
  },
}: Props): JSX.Element {
  const TableColumnField = getTableColumnField(tableColumn)
  const input = useRef<
    | {
        validity: {
          valueMissing: boolean
          typeMismatch: boolean
        }
      }
    | null
    | undefined
  >(null)

  if (!tableColumn) return <PlaceholderTableField />

  function validate() {
    let errorMessage

    if (input.current) {
      const { validity = {} as ValidityState } = input.current

      if (validity.valueMissing) errorMessage = `${label} is required.`

      if (validity.typeMismatch) errorMessage = getTypeMismatchErrorMessage(tableColumn, label)
    }

    return errorMessage
  }

  return (
    <FormikField name={tableColumn.name} validate={validate}>
      {({ field, form }: any) =>
        hidden ? (
          <input {...field} ref={input} type="hidden" />
        ) : (
          <TableColumnField
            {...field}
            type={type}
            form={form}
            tableColumn={tableColumn}
            ref={input}
            id={id}
            error={getIn(form.touched, field.name) && getIn(form.errors, field.name)}
            label={label}
            placeholder={placeholder}
            required={required}
            hideLabel={hideLabel}
          />
        )
      }
    </FormikField>
  )
}
