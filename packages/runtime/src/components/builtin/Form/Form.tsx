'use client'

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  ComponentPropsWithoutRef,
  Ref,
  useImperativeHandle,
  ForwardedRef,
} from 'react'
import { Formik, getIn } from 'formik'

import { Check12 } from '../../icons/Check12'

import { getSizeHeight as getInputSizeHeight } from './components/Field/components/Input'

import {
  Size,
  Sizes,
  Provider as FormContextProvider,
  Shape,
  Contrast,
  Alignment,
  Alignments,
} from './context/FormContext'
import Placeholder from './components/Placeholder'
import Field from './components/Field'
import Spinner from './components/Spinner'
import Button from '../Button'
import type { TableColumn } from './types'
import {
  ElementIDValue,
  ResponsiveIconRadioGroupValue,
  ResponsiveSelectValue,
  TableFormFieldsDescriptor,
  TableFormFieldsValue,
  TextInputValue,
} from '../../../prop-controllers/descriptors'
import { Link } from '../../shared/Link'
import { BoxModelHandle, getBox } from '../../../box-model'
import { PropControllersHandle } from '../../../state/modules/prop-controller-handles'
import { DescriptorsPropControllers } from '../../../prop-controllers/instances'
import { useTableFormFieldRefs } from '../../hooks/useTableFormFieldRefs'
import { useMakeswiftHostApiClient } from '../../../next/context/makeswift-host-api-client'
import { ResponsiveColor } from '../../../runtimes/react/controls'
import { cx } from '@emotion/css'
import { useResponsiveGridItem, useResponsiveStyle } from '../../utils/responsive-style'
import { useStyle } from '../../../runtimes/react/use-style'
import { useTable } from '../../../runtimes/react/hooks/makeswift-api'
import {
  LinkData,
  ResponsiveGapData,
  ResponsiveLengthData,
  ResponsiveTextStyleData,
  ResponsiveValue,
} from '@makeswift/prop-controllers'

const LOCAL_STORAGE_NAMESPACE = '@@makeswift/components/form'

function getSizeFontSize(size: Size): number {
  switch (size) {
    case Sizes.SMALL:
      return 12

    case Sizes.MEDIUM:
      return 14

    case Sizes.LARGE:
      return 18

    default:
      throw new Error(`Invalid form size "${size}"`)
  }
}

type Props = {
  id?: ElementIDValue
  tableId?: string
  fields?: TableFormFieldsValue
  submitLink?: LinkData
  gap?: ResponsiveGapData
  shape?: ResponsiveIconRadioGroupValue<Shape>
  size?: ResponsiveIconRadioGroupValue<Size>
  contrast?: ResponsiveIconRadioGroupValue<Contrast>
  labelTextStyle?: ResponsiveTextStyleData
  labelTextColor?: ResponsiveColor | null
  submitTextStyle?: ResponsiveTextStyleData
  brandColor?: ResponsiveColor | null
  submitTextColor?: ResponsiveColor | null
  submitLabel?: TextInputValue
  submitVariant?: ResponsiveSelectValue<
    'flat' | 'outline' | 'shadow' | 'clear' | 'blocky' | 'bubbly' | 'skewed'
  >
  submitWidth?: ResponsiveLengthData
  submitAlignment?: ResponsiveIconRadioGroupValue<Alignment>
  width?: string
  margin?: string
}

type GridFormBaseProps = { size?: Props['size'] }

type GridFormProps = GridFormBaseProps &
  Omit<ComponentPropsWithoutRef<'form'>, keyof GridFormBaseProps>

const GridForm = forwardRef(function GridFrom(
  { className, size, ...restOfProps }: GridFormProps,
  ref: ForwardedRef<HTMLFormElement>,
) {
  return (
    <form
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({ display: 'flex', flexWrap: 'wrap', width: '100%' }),
        useStyle(
          useResponsiveStyle([size] as const, ([size = Sizes.MEDIUM]) => ({
            fontSize: getSizeFontSize(size),
          })),
        ),
        className,
      )}
    />
  )
})

type GridItemBaseProps = {
  grid: ResponsiveValue<{ spans: number[][]; count: number }>
  index: number
  rowGap: Props['gap']
  columnGap: Props['gap']
}

type GridItemProps = GridItemBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof GridItemBaseProps>

const GridItem = forwardRef(function GridItem(
  { className, grid, index, rowGap, columnGap, ...restOfProps }: GridItemProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({ alignSelf: 'flex-end', flexDirection: 'column' }),
        useStyle(useResponsiveGridItem({ grid, index, rowGap, columnGap })),
        className,
      )}
    />
  )
})

function getAlignmentMargin(alignment: Alignment): string {
  switch (alignment) {
    case Alignments.LEFT:
      return '0 auto 0 0'
    case Alignments.RIGHT:
      return '0 0 0 auto'
    default:
      return '0 auto'
  }
}

type StyledButtonBaseProps = { size?: Props['size']; alignment?: Props['submitAlignment'] }

type StyledButtonProps = StyledButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Button>, keyof StyledButtonBaseProps>

function StyledButton({ className, size, alignment, ...restOfProps }: StyledButtonProps) {
  return (
    <Button
      {...restOfProps}
      as="button"
      className={cx(
        useStyle({ display: 'flex', alignItems: 'center', justifyContent: 'center' }),
        useStyle(
          useResponsiveStyle(
            [size, alignment] as const,
            ([size = Sizes.MEDIUM, alignment = Alignments.CENTER]) => ({
              minHeight: getInputSizeHeight(size),
              maxHeight: getInputSizeHeight(size),
              margin: getAlignmentMargin(alignment),
              paddingTop: 0,
              paddingBottom: 0,
            }),
          ),
        ),
        className,
      )}
    />
  )
}

function ErrorContainer({ className, ...restOfProps }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...restOfProps}
      className={cx(
        useStyle({
          padding: '8px 16px',
          backgroundColor: '#f19eb9',
          borderRadius: 4,
          marginTop: 16,
        }),
        className,
      )}
    />
  )
}

function IconContainer({ className, ...restOfProps }: ComponentPropsWithoutRef<'div'>) {
  return <div {...restOfProps} className={cx(useStyle({ fill: 'currentColor' }), className)} />
}

function ErrorMessage({ className, ...restOfProps }: ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      {...restOfProps}
      className={cx(
        useStyle({ fontSize: 12, margin: '8px 0', color: 'rgba(127, 0, 0, 0.95)' }),
        className,
      )}
    />
  )
}

function getTableColumnDefaultValue(tableColumn: TableColumn) {
  switch (tableColumn.__typename) {
    case 'CheckboxTableColumn':
      return false

    case 'MultipleSelectTableColumn':
      return []

    case 'SingleLineTextTableColumn':
    case 'LongTextTableColumn':
    case 'SingleSelectTableColumn':
    case 'PhoneNumberTableColumn':
    case 'EmailTableColumn':
    case 'URLTableColumn':
    case 'NumberTableColumn':
    default:
      return ''
  }
}

type Column = { columnId: string; data: Record<string, any> }
type Fields = Record<string, string | string[] | boolean>

type Descriptors = { fields?: TableFormFieldsDescriptor }

const Form = forwardRef(function Form(
  {
    id,
    tableId,
    fields: fieldsProp,
    submitLabel = 'Submit',
    submitLink,
    shape,
    size,
    contrast,
    brandColor,
    gap,
    width,
    margin,
    submitTextStyle,
    submitVariant,
    submitTextColor,
    submitWidth,
    submitAlignment,
    labelTextStyle,
    labelTextColor,
  }: Props,
  ref: Ref<BoxModelHandle & PropControllersHandle<Descriptors>>,
) {
  const fields = useMemo(() => fieldsProp?.fields ?? [], [fieldsProp])
  const grid = useMemo(() => fieldsProp?.grid ?? [], [fieldsProp])
  const table = useTable(tableId ?? null)
  const client = useMakeswiftHostApiClient()
  const [refEl, setRefEl] = useState<HTMLElement | null>(null)
  const [propControllers, setPropControllers] =
    useState<DescriptorsPropControllers<Descriptors> | null>(null)
  const [initialValues, setInitialValues] = useState<Fields>(() =>
    fields.reduce((acc, formField) => {
      const tableColumn = table && table.columns.find(field => field.id === formField.tableColumnId)
      const defaultValue = formField ? formField.defaultValue : null

      if (tableColumn) {
        acc[tableColumn.name] =
          defaultValue == null ? getTableColumnDefaultValue(tableColumn) : defaultValue
      }

      return acc
    }, {} as Fields),
  )
  const controller = propControllers?.fields
  const { container, items } = useTableFormFieldRefs(controller, { fieldsCount: fields.length })
  const [isDone, setIsDone] = useState(false)
  const linkRef = useRef<HTMLAnchorElement>(null)

  useImperativeHandle(
    ref,
    () => ({
      getDomNode() {
        return refEl instanceof Element ? refEl : null
      },
      getBoxModel() {
        return refEl instanceof Element ? getBox(refEl) : null
      },
      setPropControllers,
    }),
    [refEl, setPropControllers],
  )

  useEffect(() => {
    container(refEl)
  }, [container, refEl])

  useEffect(() => {
    if (!isDone) return

    let timeoutId = setTimeout(() => setIsDone(false), 2500)

    return () => clearTimeout(timeoutId)
  }, [isDone])

  function getTableColumn({ tableColumnId }: any) {
    return table && table.columns.find(field => tableColumnId === field.id)
  }

  async function handleSubmit(values: any, { setSubmitting, resetForm, setStatus }: any) {
    if (table) {
      const columns: Column[] = []

      fields.forEach(field => {
        const tableColumn = getTableColumn(field)

        if (tableColumn) {
          const data = values[tableColumn.name]

          if (data) {
            columns.push({ columnId: field.tableColumnId, data })

            if (field.autofill) {
              localStorage.setItem(
                `${LOCAL_STORAGE_NAMESPACE}/${tableColumn.name}`,
                JSON.stringify(data),
              )
            }
          }
        }
      })

      try {
        await client.createTableRecord(table.id, columns)
        setIsDone(true)
        setInitialValues(prev =>
          fields.reduce(
            (acc, field) => {
              const tableColumn = getTableColumn(field)

              if (tableColumn) {
                const data = values[tableColumn.name]

                if (data && field.autofill) return { ...acc, [tableColumn.name]: data }
              }

              return acc
            },
            { ...prev },
          ),
        )
        resetForm()

        if (linkRef.current != null) linkRef.current.click()
      } catch (error) {
        setStatus({ error: 'An unexpected error has occurred, please try again later' })
      } finally {
        setSubmitting(false)
      }
    }
  }

  useEffect(() => {
    setInitialValues(prev =>
      fields.reduce(
        (acc, formField) => {
          const tableColumn =
            table && table.columns.find(field => field.id === formField.tableColumnId)

          if (tableColumn && formField.autofill) {
            const storedValue = localStorage.getItem(
              `${LOCAL_STORAGE_NAMESPACE}/${tableColumn.name}`,
            )

            if (storedValue) {
              try {
                acc[tableColumn.name] = JSON.parse(storedValue)
              } catch (e) {
                // Ignore
              }
            }
          }

          return acc
        },
        { ...prev },
      ),
    )
  }, [fields, table])

  return (
    <FormContextProvider
      value={{ shape, size, contrast, brandColor, labelTextStyle, labelTextColor }}
    >
      {tableId == null ? (
        <Placeholder ref={setRefEl} width={width} margin={margin} />
      ) : (
        <>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            initialStatus={{ error: null }}
            enableReinitialize
          >
            {formik => {
              const error = formik.status && formik.status.error
              const errors = fields
                .map(field => {
                  const tableColumn = getTableColumn(field)

                  return (
                    tableColumn &&
                    getIn(formik.touched, tableColumn.name) &&
                    getIn(formik.errors, tableColumn.name)
                  )
                })
                .filter(message => typeof message === 'string')

              return (
                <>
                  <GridForm
                    ref={setRefEl}
                    id={id}
                    className={cx(width, margin)}
                    size={size}
                    onSubmit={formik.handleSubmit}
                    onReset={formik.handleReset}
                    noValidate
                  >
                    {fields.map((field, index) => {
                      const tableColumn = getTableColumn(field)

                      return (
                        <GridItem
                          key={field.id}
                          ref={items[index]}
                          grid={grid}
                          index={index}
                          rowGap={gap}
                          columnGap={gap}
                        >
                          <Field tableColumn={tableColumn} tableFormField={field} />
                        </GridItem>
                      )
                    })}
                    <GridItem
                      ref={items[fields.length]}
                      grid={grid}
                      index={fields.length}
                      rowGap={gap}
                      columnGap={gap}
                    >
                      <StyledButton
                        type="submit"
                        // @ts-ignore: `disabled` is in `'button'` but not in `T`.
                        disabled={formik.isSubmitting || isDone}
                        shape={shape}
                        size={size}
                        color={brandColor}
                        variant={submitVariant}
                        textColor={submitTextColor}
                        width={submitWidth}
                        alignment={submitAlignment}
                        textStyle={submitTextStyle}
                      >
                        {formik.isSubmitting ? (
                          <Spinner />
                        ) : isDone ? (
                          <IconContainer>
                            <Check12 />
                          </IconContainer>
                        ) : (
                          submitLabel
                        )}
                      </StyledButton>
                      {(errors.length > 0 || error) && (
                        <ErrorContainer>
                          {errors.map(message => (
                            <ErrorMessage key={message}>{message}</ErrorMessage>
                          ))}
                          {error != null && <ErrorMessage>{error}</ErrorMessage>}
                        </ErrorContainer>
                      )}
                    </GridItem>
                  </GridForm>
                  {submitLink != null && <Link ref={linkRef} hidden link={submitLink} />}
                </>
              )
            }}
          </Formik>
        </>
      )}
    </FormContextProvider>
  )
})

export default Form
