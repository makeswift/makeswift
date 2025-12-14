/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ElementData } from '../../../../state/read-only-state'
import { randomUUID } from 'crypto'
import {
  TableFormFields,
  TableFormFieldsDescriptor,
  Types,
  createTableFormFieldsPropControllerDataFromTableFormFieldsData,
  TableFormFieldsData,
} from '@makeswift/prop-controllers'
import { Page } from '../../page'
import { ReactRuntime } from '../../../../react'
import { forwardRef, act } from 'react';
import * as Testing from '../../../testing'

describe('Page', () => {
  test('can render TableFormFieldsPropController v0 data', async () => {
    // Arrange
    const tableFormFieldsDefinitionV0: TableFormFieldsDescriptor = {
      type: Types.TableFormFields,
      options: {},
    }
    const tableFormFieldsData: TableFormFieldsData = {
      fields: [{ id: '1', tableColumnId: 'testId' }],
      grid: [],
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          tableFormFields: createTableFormFieldsPropControllerDataFromTableFormFieldsData(
            tableFormFieldsData,
            tableFormFieldsDefinitionV0,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { tableFormFields?: TableFormFieldsData }>(
        ({ tableFormFields }, ref) => {
          return (
            <div ref={ref} data-testid={testId}>
              {tableFormFields?.fields.at(0)?.tableColumnId}
            </div>
          )
        },
      ),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          tableFormFields: TableFormFields(),
        },
      },
    )

    await act(async () =>
      render(
        <Testing.ReactProvider runtime={runtime}>
          <Page snapshot={snapshot} />
        </Testing.ReactProvider>,
      ),
    )

    expect(screen.getByTestId(testId)).toHaveTextContent('testId')
  })

  test('can render TableFormFieldsPropController v1 data', async () => {
    // Arrange
    const tableFormFieldsDefinitionV1: TableFormFieldsDescriptor = {
      type: Types.TableFormFields,
      version: 1,
      options: {},
    }
    const tableFormFieldsData: TableFormFieldsData = {
      fields: [{ id: '1', tableColumnId: 'testId' }],
      grid: [],
    }
    const TestComponentType = 'TestComponent'
    const testId = 'test-id'
    const elementData: ElementData = Testing.createRootComponent([
      {
        key: randomUUID(),
        type: TestComponentType,
        props: {
          tableFormFields: createTableFormFieldsPropControllerDataFromTableFormFieldsData(
            tableFormFieldsData,
            tableFormFieldsDefinitionV1,
          ),
        },
      },
    ])
    const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
    const runtime = new ReactRuntime()

    runtime.registerComponent(
      forwardRef<HTMLDivElement, { tableFormFields?: TableFormFieldsData }>(
        ({ tableFormFields }, ref) => {
          return (
            <div ref={ref} data-testid={testId}>
              {tableFormFields?.fields.at(0)?.tableColumnId}
            </div>
          )
        },
      ),
      {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          tableFormFields: TableFormFields(),
        },
      },
    )

    await act(async () =>
      render(
        <Testing.ReactProvider runtime={runtime}>
          <Page snapshot={snapshot} />
        </Testing.ReactProvider>,
      ),
    )

    expect(screen.getByTestId(testId)).toHaveTextContent('testId')
  })
})
