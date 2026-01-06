import { useRef, ReactNode } from 'react'
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

// Escape characters: [ ] '
function escapeCharacters(string: string) {
  return string.replace(/[[\]']/g, '\\$&')
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
}: Props): ReactNode {
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

  // We're using `['${tableColumn.name}']` to avoid default Formik nested object behavior
  // which was causing an issue for table column names containing a dot.
  // https://formik.org/docs/guides/arrays#avoid-nesting
  // We need to escape square brackets [ ] because it's also used by Lodash
  // set array: https://lodash.com/docs/4.17.15#set, which is used by Formik.
  // We need to escape ' because otherwise Formik will wrap the field name inside a ''
  // for example, if we have hello'world, Formik will name the field 'hello'world'
  const formikFieldName = `['${escapeCharacters(tableColumn.name)}']`

  return (
    <FormikField name={formikFieldName} validate={validate}>
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
