import { forwardRef, SyntheticEvent } from 'react'

import TableColumnRadioButtonGroup from './components/TableColumnRadioButtonGroup'
import TableColumnSingleSelect from './components/TableColumnSingleSelect'

type Props = {
  id: string
  name: string
  tableColumn: {
    options: Array<{
      id: string
      name: string
    }>
  }
  label?: string
  value?: string
  onChange: (arg0: SyntheticEvent<HTMLInputElement>) => unknown
  required?: boolean
  type: 'select' | 'radio'
}

export default forwardRef<
  {
    readonly validity: {
      readonly valueMissing: boolean
      readonly typeMismatch: boolean
    }
  },
  Props
>(function SingleSelectTableField({ type, ...restOfProps }: Props, ref) {
  return type === 'select' ? (
    // @ts-expect-error: custom ref doesn't match select element
    <TableColumnSingleSelect {...restOfProps} ref={ref} />
  ) : (
    <TableColumnRadioButtonGroup {...restOfProps} ref={ref} />
  )
})
